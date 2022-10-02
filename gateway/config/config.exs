# General application configuration
import Config

# Configures the endpoint
config :gateway, GatewayWeb.Endpoint,
  url: [host: "localhost"],
  render_errors: [view: GatewayWeb.ErrorView, accepts: ~w(json), layout: false],
  pubsub_server: Gateway.PubSub,
  live_view: [signing_salt: "av1ppOas"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
