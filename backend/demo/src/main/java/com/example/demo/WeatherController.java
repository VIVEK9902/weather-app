package com.example.demo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "${cors.allowed.origin}") // configure in application.properties
public class WeatherController {

    @Value("${weatherapi.base.url}")
    private String baseUrl;

    @Value("${weatherapi.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public WeatherController(RestTemplateBuilder builder, ObjectMapper objectMapper) {
        this.restTemplate = builder.build();
        this.objectMapper = objectMapper;
    }

    /**
     * Accepts:
     *  - ?city=CityName
     *  - or ?lat=12.34&lon=56.78
     *
     * Returns JSON with current weather and a forecast array (3 days).
     */
    @GetMapping
    public ResponseEntity<?> getWeather(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {

        try {
            String qParam;
            if (city != null && !city.isBlank()) {
                qParam = URLEncoder.encode(city, StandardCharsets.UTF_8);
            } else if (lat != null && lon != null) {
                qParam = String.format("%f,%f", lat, lon);
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Missing parameters",
                        "message", "Please provide either city or lat & lon"
                ));
            }

            // Use forecast endpoint to get both current + forecast
            String url = String.format("%s/forecast.json?key=%s&q=%s&days=3&aqi=no&alerts=yes",
                    baseUrl, apiKey, qParam);

            String body = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(body);

            // Location
            JsonNode location = root.path("location");
            Map<String, Object> out = new HashMap<>();
            out.put("city", location.path("name").asText(""));
            out.put("region", location.path("region").asText(""));
            out.put("country", location.path("country").asText(""));

            // Current
            JsonNode current = root.path("current");
            out.put("temp_c", current.path("temp_c").asDouble(Double.NaN));
            out.put("feelslike_c", current.path("feelslike_c").asDouble(Double.NaN));
            out.put("humidity", current.path("humidity").asInt(-1));
            out.put("pressure_mb", current.path("pressure_mb").asInt(-1));
            out.put("wind_kph", current.path("wind_kph").asDouble(Double.NaN));
            out.put("wind_dir", current.path("wind_dir").asText(""));
            out.put("vis_km", current.path("vis_km").asDouble(Double.NaN));
            out.put("uv", current.path("uv").asDouble(Double.NaN));
            String conditionText = current.path("condition").path("text").asText("");
            out.put("condition", conditionText);

            // icon: ensure full url (WeatherAPI returns //cdn...)
            String rawIcon = current.path("condition").path("icon").asText("");
            if (rawIcon.startsWith("//")) rawIcon = "https:" + rawIcon;
            out.put("icon", rawIcon);

            // Forecast (3 days)
            List<Map<String, Object>> forecastList = new ArrayList<>();
            JsonNode forecastDays = root.path("forecast").path("forecastday");
            if (forecastDays.isArray()) {
                for (JsonNode dayNode : forecastDays) {
                    Map<String, Object> day = new HashMap<>();
                    day.put("date", dayNode.path("date").asText());
                    // day.temp: using day.avgtemp_c (or max/min)
                    JsonNode dayInfo = dayNode.path("day");
                    day.put("avg_temp_c", dayInfo.path("avgtemp_c").asDouble(Double.NaN));
                    day.put("max_temp_c", dayInfo.path("maxtemp_c").asDouble(Double.NaN));
                    day.put("min_temp_c", dayInfo.path("mintemp_c").asDouble(Double.NaN));
                    String dcond = dayInfo.path("condition").path("text").asText("");
                    day.put("condition", dcond);
                    String dicon = dayInfo.path("condition").path("icon").asText("");
                    if (dicon.startsWith("//")) dicon = "https:" + dicon;
                    day.put("icon", dicon);
                    forecastList.add(day);
                }
            }

            out.put("forecast", forecastList);

            // return the assembled response
            return ResponseEntity.ok(out);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Failed to fetch weather",
                    "details", e.getMessage()
            ));
        }
    }
}