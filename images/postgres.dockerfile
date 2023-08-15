# Use the official PostgreSQL image as the base image
FROM postgres:alpine as base

# Set environment variables for PostgreSQL
# ENV POSTGRES_USER=myuser
# ENV POSTGRES_PASSWORD=mypassword
# ENV POSTGRES_DB=mydatabase

# Copy custom configuration if needed
# COPY postgres.conf /etc/postgresql/postgresql.conf

# Expose the PostgreSQL port (default is 5432)
EXPOSE 5433

# Start the PostgreSQL service
CMD ["postgres"]


FROM base as production
