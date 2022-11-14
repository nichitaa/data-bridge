defmodule GatewayWeb.ErrorView do
  use GatewayWeb, :view

  def template_not_found(template, _assigns) do
    %{
      errors: %{
        detail: Phoenix.Controller.status_message_from_template(template)
      },
      success: false
    }
  end
end
