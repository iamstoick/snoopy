
// Utility for generating equivalent code in Go and PHP

// Generate Go code based on the URL and server type
export const generateGoCode = (url: string, serverType: string) => {
  return `
package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: cachecheck <url>")
		os.Exit(1)
	}

	url := os.Args[1]
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		url = "https://" + url
	}

	fmt.Printf("Checking caching headers for: %s\\n\\n", url)
	
	start := time.Now()
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("Error: %v\\n", err)
		os.Exit(1)
	}
	defer resp.Body.Close()
	
	responseTime := time.Since(start).Milliseconds()

	fmt.Printf("Status Code: %d\\n", resp.StatusCode)
	fmt.Printf("Response Time: %dms\\n\\n", responseTime)

	// Extract and display server info
	if server := resp.Header.Get("Server"); server != "" {
		fmt.Printf("Server: %s\\n", server)
	} else {
		fmt.Println("Server: Unknown")
	}

	// Check cache-related headers
	cacheControl := resp.Header.Get("Cache-Control")
	etag := resp.Header.Get("ETag")
	lastModified := resp.Header.Get("Last-Modified")
	expires := resp.Header.Get("Expires")
	age := resp.Header.Get("Age")

	fmt.Println("\\nCaching Headers:")
	if cacheControl != "" {
		fmt.Printf("Cache-Control: %s\\n", cacheControl)
	}
	if etag != "" {
		fmt.Printf("ETag: %s\\n", etag)
	}
	if lastModified != "" {
		fmt.Printf("Last-Modified: %s\\n", lastModified)
	}
	if expires != "" {
		fmt.Printf("Expires: %s\\n", expires)
	}
	if age != "" {
		fmt.Printf("Age: %s\\n", age)
	}

	// Analyze caching effectiveness
	fmt.Println("\\nCaching Analysis:")
	
	isCacheable := false
	maxAge := 0
	cacheStatus := "miss"

	if strings.Contains(cacheControl, "no-store") {
		fmt.Println("❌ This resource is explicitly not cacheable (no-store directive).")
	} else if strings.Contains(cacheControl, "no-cache") {
		fmt.Println("⚠️ This resource requires revalidation on each request (no-cache directive).")
		isCacheable = true
	} else if strings.Contains(cacheControl, "max-age=") {
		parts := strings.Split(cacheControl, "max-age=")
		if len(parts) > 1 {
			fmt.Sscanf(parts[1], "%d", &maxAge)
			fmt.Printf("✅ This resource can be cached for %d seconds.\\n", maxAge)
			isCacheable = true
			
			if age != "" {
				var ageVal int
				fmt.Sscanf(age, "%d", &ageVal)
				if ageVal > 0 {
					fmt.Printf("🔄 The resource has been in cache for %d seconds.\\n", ageVal)
					cacheStatus = "hit"
				}
			}
		}
	} else if etag != "" || lastModified != "" {
		fmt.Println("✅ This resource supports validation via ETag or Last-Modified.")
		isCacheable = true
	} else if expires != "" {
		fmt.Println("✅ This resource has an Expires header for caching.")
		isCacheable = true
	} else {
		fmt.Println("❌ No explicit caching directives found.")
	}

	// Human-readable summary
	fmt.Println("\\nSummary:")
	if isCacheable {
		if cacheStatus == "hit" {
			fmt.Printf("This website is using a %s server and has good caching configuration. ", 
			            resp.Header.Get("Server"))
			fmt.Println("The page was served from cache, which explains the fast response time.")
			fmt.Println("This means repeat visitors will experience faster page loads.")
		} else {
			fmt.Printf("This website is using a %s server and has caching configured. ", 
			            resp.Header.Get("Server"))
			fmt.Printf("The page was not served from cache, with a response time of %dms. ", 
			            responseTime)
			fmt.Println("Repeat visitors may experience faster page loads if their browser caches the content.")
		}
	} else {
		fmt.Printf("This website is using a %s server but doesn't appear to be cached properly. ", 
		            resp.Header.Get("Server"))
		fmt.Printf("The page took %dms to load. ", responseTime)
		fmt.Println("Implementing proper caching could improve performance for repeat visitors.")
	}
}`;
};

// Generate PHP code based on the URL and server type
export const generatePhpCode = (url: string, serverType: string) => {
  return `<?php
/**
 * HTTP Header Cache Checker - PHP 8.1+ Compatible
 * 
 * A simple PHP script to check HTTP caching headers of a website
 * and provide a human-readable analysis.
 */

// Check if URL is provided
if ($argc < 2) {
    echo "Usage: php cachecheck.php <url>\\n";
    exit(1);
}

$url = $argv[1];

// Ensure URL has http:// or https:// prefix
if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
    $url = "https://$url";
}

echo "Checking caching headers for: $url\\n\\n";

// Initialize curl session
$ch = curl_init();

// Set curl options
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_NOBODY => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
]);

// Measure response time
$start_time = microtime(true);
$response = curl_exec($ch);
$end_time = microtime(true);
$response_time = round(($end_time - $start_time) * 1000); // in ms

// Check for curl errors
if (curl_errno($ch)) {
    echo "Error: " . curl_error($ch) . "\\n";
    exit(1);
}

// Get status code
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$headers = substr($response, 0, $header_size);

// Close curl session
curl_close($ch);

// Display basic info
echo "Status Code: $status_code\\n";
echo "Response Time: {$response_time}ms\\n\\n";

// Parse headers
$header_lines = explode("\\n", $headers);
$parsed_headers = [];

foreach ($header_lines as $line) {
    $line = trim($line);
    if (empty($line)) continue;
    
    // Skip the HTTP/1.1 line
    if (str_starts_with($line, 'HTTP/')) continue;
    
    // Split header into name and value
    $parts = explode(':', $line, 2);
    if (count($parts) === 2) {
        $name = trim($parts[0]);
        $value = trim($parts[1]);
        $parsed_headers[$name] = $value;
    }
}

// Extract and display server info
$server = $parsed_headers['Server'] ?? 'Unknown';
echo "Server: $server\\n\\n";

// Check cache-related headers
$cache_control = $parsed_headers['Cache-Control'] ?? '';
$etag = $parsed_headers['ETag'] ?? '';
$last_modified = $parsed_headers['Last-Modified'] ?? '';
$expires = $parsed_headers['Expires'] ?? '';
$age = $parsed_headers['Age'] ?? '';

echo "Caching Headers:\\n";
if (!empty($cache_control)) echo "Cache-Control: $cache_control\\n";
if (!empty($etag)) echo "ETag: $etag\\n";
if (!empty($last_modified)) echo "Last-Modified: $last_modified\\n";
if (!empty($expires)) echo "Expires: $expires\\n";
if (!empty($age)) echo "Age: $age\\n";

// Analyze caching effectiveness
echo "\\nCaching Analysis:\\n";

$is_cacheable = false;
$max_age = 0;
$cache_status = "miss";

if (str_contains($cache_control, 'no-store')) {
    echo "❌ This resource is explicitly not cacheable (no-store directive).\\n";
} elseif (str_contains($cache_control, 'no-cache')) {
    echo "⚠️ This resource requires revalidation on each request (no-cache directive).\\n";
    $is_cacheable = true;
} elseif (str_contains($cache_control, 'max-age=')) {
    preg_match('/max-age=([0-9]+)/', $cache_control, $matches);
    if (isset($matches[1])) {
        $max_age = (int)$matches[1];
        echo "✅ This resource can be cached for $max_age seconds.\\n";
        $is_cacheable = true;
        
        if (!empty($age)) {
            $age_val = (int)$age;
            if ($age_val > 0) {
                echo "🔄 The resource has been in cache for $age_val seconds.\\n";
                $cache_status = "hit";
            }
        }
    }
} elseif (!empty($etag) || !empty($last_modified)) {
    echo "✅ This resource supports validation via ETag or Last-Modified.\\n";
    $is_cacheable = true;
} elseif (!empty($expires)) {
    echo "✅ This resource has an Expires header for caching.\\n";
    $is_cacheable = true;
} else {
    echo "❌ No explicit caching directives found.\\n";
}

// Human-readable summary
echo "\\nSummary:\\n";
if ($is_cacheable) {
    if ($cache_status === "hit") {
        echo "This website is using a $server server and has good caching configuration. ";
        echo "The page was served from cache, which explains the fast response time.\\n";
        echo "This means repeat visitors will experience faster page loads.\\n";
    } else {
        echo "This website is using a $server server and has caching configured. ";
        echo "The page was not served from cache, with a response time of {$response_time}ms.\\n";
        echo "Repeat visitors may experience faster page loads if their browser caches the content.\\n";
    }
} else {
    echo "This website is using a $server server but doesn't appear to be cached properly. ";
    echo "The page took {$response_time}ms to load.\\n";
    echo "Implementing proper caching could improve performance for repeat visitors.\\n";
}
`;
};
