import Config

# General configs
config :gateway,
  auth_service_base_url: "http://auth-service:8080"

# Do not print debug messages in production
config :logger, level: :info
