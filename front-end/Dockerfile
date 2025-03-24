# Use Nginx as the base image
FROM nginx:alpine

# Copy custom Nginx configuration (optional, if you have one)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy frontend files (HTML, CSS, JS) to the Nginx web root
COPY . /usr/share/nginx/html

# Expose port 80 for serving the frontend
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
