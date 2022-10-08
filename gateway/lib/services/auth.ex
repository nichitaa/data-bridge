defmodule GatewayWeb.Services.Auth do
  def register(client, payload) do
    Tesla.post(client, "/api/Account/register", payload)
  end

  def login(client, payload) do
    Tesla.post(client, "/api/Account/login", payload)
  end

  def is_authorized(client) do
    Tesla.get(client, "/api/Account/IsAuthorized")
  end

  def client(token) do
    middleware = [
      Tesla.Middleware.Logger,
      Tesla.Middleware.KeepRequest,
      {Tesla.Middleware.JSON, decode_content_types: ["application/problem+json"]},
      {Tesla.Middleware.BaseUrl, Application.fetch_env!(:gateway, :auth_service_base_url)},
      {Tesla.Middleware.BearerAuth, token: token},
      {Tesla.Middleware.Timeout, timeout: 2_000},
      {Tesla.Middleware.Retry, delay: 50, max_delay: 2000, max_retries: 3}
    ]

    Tesla.client(middleware)
  end
end
