import java.util.HashMap;
import java.util.Map;

public class CustomJSONObject {

    private final Map<String, Object> data = new HashMap<>();

    public void put(String key, Object value) {
        data.put(key, value);
    }

    public Object get(String key) {
        return data.get(key);
    }

    @Override
    public String toString() {
        return toString(0);
    }

    private String toString(int indent) {
        StringBuilder sb = new StringBuilder();
        StringBuilder indentation = new StringBuilder();
        for (int i = 0; i < indent; i++) {
            indentation.append("  "); // Using 2 spaces for indentation.
        }

        sb.append("{\n");

        for (Map.Entry<String, Object> entry : data.entrySet()) {
            sb.append(indentation).append("  \"").append(entry.getKey()).append("\": ");
            if (entry.getValue() instanceof CustomJSONObject) {
                sb.append(((CustomJSONObject) entry.getValue()).toString(indent + 1));
            } else if (entry.getValue() instanceof String) {
                sb.append("\"").append(entry.getValue()).append("\"");
            } else {
                sb.append(entry.getValue());
            }
            sb.append(",\n");
        }

        if (!data.isEmpty()) {
            sb.setLength(sb.length() - 2); // Removing trailing comma and newline.
        }

        sb.append("\n").append(indentation).append("}");

        return sb.toString();
    }

}
