import { Component } from "../../../components/component.mjs";
import {
  RequestFailedError,
  UnprocessableEntityError,
} from "../../../services/errors.mjs";
import { PlayerService } from "../../../services/player.mjs";
import { session } from "../../../state/session.mjs";
import { useMatchesHistory } from "../hooks/useMatchesHistory.mjs";
import { useMatchListeners } from "../hooks/useMatchListeners.mjs";
import { useTournamentHistory } from "../hooks/useTournamentHistory.mjs";
import { useTournamentListeners } from "../hooks/useTournamentListeners.mjs";

/** @type {import("../../router/router.mjs").Page} */
export const Profile = () => {
  const page = new Component("div").class("container-lg mx-auto");

  page.element.innerHTML = `
  <t-navbar></t-navbar>
  <div class="d-flex flex-column p-2 rounded mt-2">
    <h1 class="text-center" data-bs-theme="secondary">Perfil</h1>
  </div>

  		<div class="profile-content">
				<div class="profile-info">
					<div class="info-details">
						<h2>Informações</h2>
						<p><strong>Pontuação Total:</strong> ${session.player.stats.total_score}</p>
						<p><strong>Tempo Jogado:</strong> ${session.player.stats.total_play_time}s</p>
					</div>
					<div class="avatar-section">
						<t-input-image theme="none" class="profile-avatar">
							<img id="avatar-preview" class="avatar-img" />
						</t-input-image>
						<t-button id="avatar-save-button" btn-class="w-100 mt-3">Salvar</t-button>
					</div>
				</div>

				<form id="update-form" class="update-form">
					<div class="form-group">
						<label for="email-placeholder">Email:</label>
						<span id="email-placeholder"></span>
					</div>

					<t-input id="input-name" label="Nome"></t-input>

					<t-errors id="update-form-errors" class="mt-3"></t-errors>
					<t-button id="save-button" btn-class="w-100 mt-3">Salvar</t-button>
				</form>

				<t-toast id="update-avatar-toast-success">
					<strong slot="header">Sucesso!</strong>
					Seu avatar foi atualizado com sucesso!
				</t-toast>
				<t-toast id="update-form-toast-success">
					<strong slot="header">Sucesso!</strong>
					Seu perfil foi atualizado com sucesso!
				</t-toast>
			</div>

			<div class="profile-sections">
				<div class="section tournaments">
					<h2>Torneios</h2>
					<t-loading id="loading-tournaments" loading="true">
						<div id="tournaments-container" class="section-content">
							<!-- Conteúdo dos torneios aqui -->
						</div>
					</t-loading>
				</div>
				<div class="section matches">
					<h2>Partidas</h2>
					<t-loading id="loading-matches" loading="true">
						<div id="matches-container" class="section-content">
							<!-- Conteúdo das partidas aqui -->
						</div>
					</t-loading>
				</div>
			</div>
  </div>
`;

  useMatchListeners();
  useTournamentListeners();

  useTournamentHistory(page, { from_player: session.player });
  useMatchesHistory(page, { from_player: session.player });

  const t_input_image_avatar = page.element.querySelector("t-input-image");
  const img_avatar_preview = page.element.querySelector("#avatar-preview");
  const t_button_avatar_save = page.element.querySelector(
    "#avatar-save-button"
  );

  const form = page.element.querySelector("#update-form");
  const t_input_name = form.querySelector("#input-name");
  const t_errors_update_form = form.querySelector("#update-form-errors");
  const t_button_save = form.querySelector("#save-button");
  const email_placeholder = form.querySelector("#email-placeholder");

  const t_toast_success_update_avatar = page.element.querySelector(
    "#update-avatar-toast-success"
  );
  const t_toast_success_update_form = page.element.querySelector(
    "#update-form-toast-success"
  );

  t_input_name.value = session.player.name;
  email_placeholder.textContent = session.player.email;

  let name = t_input_name.value;

  t_input_name.input.addEventListener("change", (e) => {
    name = e.target.value;
  });

  t_input_image_avatar.input.addEventListener("change", async (event) => {
    const images = await t_input_image_avatar.getImages();
    img_avatar_preview.src = images[0].src;
  });

  img_avatar_preview.src = session.player.avatar ?? undefined;

  t_button_avatar_save.addEventListener("click", async (event) => {
    try {
      const file = t_input_image_avatar.files[0];
      if (!file) return;
      t_button_avatar_save.setLoading(true);
      const player = await PlayerService.updatePlayerAvatar({
        avatar: file,
      });
      session.player = player;
      t_toast_success_update_avatar.open();
    } catch (error) {
      if (error instanceof UnprocessableEntityError) {
        t_input_image_avatar.addErrors(error.data?.error?.name);
      } else if (error instanceof RequestFailedError) {
        t_input_image_avatar.addErrors(error.data?.error?.name);
      }
    } finally {
      t_button_avatar_save.setLoading(false);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    t_input_name.clearErrors();
    t_errors_update_form.clearErrors();

    try {
      t_button_save.setLoading(true);
      const player = await PlayerService.updatePlayer({
        name: name,
      });
      session.player = player;
      t_toast_success_update_form.open();
    } catch (error) {
      if (error instanceof UnprocessableEntityError) {
        t_input_name.addErrors(error.data?.error?.name);
        t_errors_update_form.addErrors(error.data?.error?._errors);
      } else if (error instanceof RequestFailedError) {
        t_errors_update_form.addErrors(error.data?.error?._errors);
      }
    } finally {
      t_button_save.setLoading(false);
    }
  });

  return page;
};
