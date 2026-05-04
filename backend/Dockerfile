# Use lightweight Java 17 image
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy built jar
COPY target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]