# General application configuration
import Config

# General configs
config :gateway,
  auth_service_base_url: "http://localhost:8080",
  main_api_service_base_url: "http://localhost:8081"

# Configures the endpoint
config :gateway, GatewayWeb.Endpoint,
  url: [host: "localhost"],
  render_errors: [view: GatewayWeb.ErrorView, accepts: ~w(json), layout: false],
  pubsub_server: Gateway.PubSub,
  live_view: [signing_salt: "av1ppOas"],
  # configuring Cowboy2Adapter: https://hexdocs.pm/phoenix/Phoenix.Endpoint.Cowboy2Adapter.html
  http: [
    transport_options: [
      # => increase for prod (I don't want to see that many processes in :observer.start)
      num_acceptors: 2,
      # => default
      max_connections: 16_384
    ]
  ]

# Tesla config
config :tesla,
       :adapter,
       {Tesla.Adapter.Finch, name: FinchClient}

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
