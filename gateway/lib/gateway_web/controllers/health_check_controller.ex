defmodule GatewayWeb.HealthCheckController do
  use GatewayWeb, :controller

  def get_env(conn, params), do: json(conn, %{mix_env: Mix.env(), success: true})
end
