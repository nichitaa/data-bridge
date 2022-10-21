defmodule GatewayWeb.Services.Auth do
  def register(client, payload) do
    Tesla.post(client, "/api/Account/register", payload) |> get_response_body()
  end

  def login(client, payload) do
    Tesla.post(client, "/api/Account/login", payload) |> get_response_body()
  end

  def get_self(client) do
    Tesla.get(client, "/api/Account/GetSelf") |> get_response_body()
  end

  def client(token) do
    middleware = [
      Tesla.Middleware.Logger,
      Tesla.Middleware.KeepRequest,
      {Tesla.Middleware.JSON,
       decode_content_types: ["application/problem+json", "application/json"]},
      {Tesla.Middleware.BaseUrl, Application.fetch_env!(:gateway, :auth_service_base_url)},
      {Tesla.Middleware.BearerAuth, token: token},
      {Tesla.Middleware.Timeout, timeout: 2_000},
      {Tesla.Middleware.Retry, delay: 50, max_delay: 2000, max_retries: 3},
      {Tesla.Middleware.Headers, [{"content-type", "application/json"}]}
    ]

    Tesla.client(middleware)
  end

  ## Privates

  defp get_response_body({:ok, %Tesla.Env{body: response_body}}), do: response_body
end
