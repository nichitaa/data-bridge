defmodule GatewayWeb.WorkspacePresence do
  use Phoenix.Presence,
    otp_app: :gateway,
    pubsub_server: Gateway.PubSub
end
