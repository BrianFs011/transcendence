import { PlayerCommunication } from "../../communication/player.mjs";
import { Component } from "../../components/component.mjs";
import { router } from "../../index.mjs";
import { RequestFailedError } from "../../services/errors.mjs";
import { PlayerService } from "../../services/player.mjs";
import { session } from "../../state/session.mjs";

/** @type {import("../../router/router.mjs").Page} */
export const Login = () => {
  const page = new Component("div").class("container-lg mx-auto");

  page.element.innerHTML = `
		<div class="mx-auto mt-5 p-5 rounded" style="max-width: 400px; background-color: #f7f9fc; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
			<div class="d-flex flex-column rounded">
				<h1 class="text-center" data-bs-theme="secondary">Login</h1>
			</div>
			<div class="top-image mt-3 text-center">
				<img src="/media/default/front/banner.jpg" alt="Banner" class="rounded" style="width: 150px;">
			</div>
			<form id="login-form" class="container d-flex flex-column gap-3 mt-4">
				<t-input id="input-email" label="Email" type="email"></t-input>
				<t-input id="input-password" label="Senha" type="password"></t-input>

				<t-errors id="errors"></t-errors>
				<t-button id="login-button" class="d-block" btn-class="w-100" theme="info">Entrar</t-button>
			</form>

			<p class="mt-5 text-center">
				Não tem uma conta?
				<t-button to="/register" theme="outlineInfo">Registre agora</t-button>
			</p>
		</div>
  `;

  let email = "";
  let password = "";

  const form = page.element.querySelector("#login-form");
  const t_input_email = form.querySelector("#input-email");
  const t_input_password = form.querySelector("#input-password");
  const t_errors = form.querySelector("#errors");
  const t_button_login = form.querySelector("#login-button");

  t_input_email.input.addEventListener("change", (e) => {
    email = e.target.value;
  });

  t_input_password.input.addEventListener("change", (e) => {
    password = e.target.value;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    t_input_email.clearErrors();
    t_input_password.clearErrors();
    t_errors.clearErrors();

    try {
      t_button_login.setLoading(true);
      const player = await PlayerService.login({
        email: email,
        password: password,
      });
      session.player = player;
      PlayerCommunication.Communication.connect();
      router.navigate("/auth");
    } catch (error) {
      if (error instanceof RequestFailedError) {
        t_input_email.addErrors(error.data?.error?.email);
        t_input_password.addErrors(error.data?.error?.password);
        t_errors.addErrors(error.data?.error?._errors);
      }
    } finally {
      t_button_login.setLoading(false);
    }
  });

  return page;
};
