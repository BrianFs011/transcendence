import { Component } from "../../../components/component.mjs";
import { router } from "../../../index.mjs";
import { PlayerService } from "../../../services/player.mjs";
import { session } from "../../../state/session.mjs";
import { useCreateTournament } from "./hooks/useCreateTournament.mjs";
import { useFindMatch } from "./hooks/useFindMatch.mjs";
import { useCreateMatch } from "./hooks/useCreateMatch.mjs";
import { useMatchListeners } from "../hooks/useMatchListeners.mjs";
import { useTournamentListeners } from "../hooks/useTournamentListeners.mjs";

/** @type {import("../../router/router.mjs").Page} */
export const Home = () => {
  const page = new Component("div")
    .class("container-lg");

  page.element.innerHTML = `
  <t-navbar></t-navbar>
	<div class="selection-container d-flex flex-column align-items-center">
  	<div class="header-title text-center my-5">
    <h1 class="display-4 fw-bold text-primary">Escolha Sua Próxima Aventura</h1>
  </div>

  <div class="cards-container d-flex flex-wrap justify-content-center gap-4">
    <div class="card-option position-relative">
      <div class="card-image create-local-match"></div>
      <div class="card-content text-center">
        <h3>Criar Partida Local</h3>
        <t-button id="local-match-create-button" class="mt-3" theme="primary">Iniciar</t-button>
      </div>
    </div>

    <div class="card-option position-relative">
      <div class="card-image create-match"></div>
      <div class="card-content text-center">
        <h3>Criar Partida Online</h3>
        <t-button id="match-create-open-modal-button" class="mt-3" theme="primary">Iniciar</t-button>
      </div>
    </div>

    <div class="card-option position-relative">
      <div class="card-image create-tournament"></div>
      <div class="card-content text-center">
        <h3>Criar Torneio</h3>
        <t-button id="tournament-create-open-modal-button" class="mt-3" theme="primary">Iniciar</t-button>
      </div>
    </div>

    <div class="card-option position-relative">
      <div class="card-image find-match"></div>
				<div class="card-content text-center">
					<h3>Encontrar Partida</h3>
					<t-button id="find-match-button" class="mt-3" theme="primary">Buscar</t-button>
				</div>
				<t-errors id="find-match-errors" class="mt-2"></t-errors>
				</div>
			</div>
		</div>

		<!-- Modal Criar Torneio -->
		<div id="tournament-create-modal" class="modal fade" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Criar Torneio</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
					</div>
					<div class="modal-body">
						<t-input label="Nome"></t-input>
						<t-multiple-select class="mt-2"></t-multiple-select>
					</div>
					<div class="modal-footer">
						<t-button data-bs-dismiss="modal" theme="secondary">Fechar</t-button>
						<t-button id="tournament-create-modal-create-button">Criar</t-button>
					</div>
				</div>
			</div>
		</div>

		<!-- Modal Criar Partida -->
		<div id="match-create-modal" class="modal fade" tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Criar Partida</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
					</div>
					<div class="modal-body">
						<t-multiple-select class="mt-2"></t-multiple-select>
					</div>
					<div class="modal-footer">
						<t-button data-bs-dismiss="modal" theme="secondary">Fechar</t-button>
						<t-button id="match-create-modal-create-button">Criar</t-button>
					</div>
				</div>
			</div>
		</div>
  `;

  useCreateMatch(page);
  useCreateTournament(page);
  useFindMatch(page);
  useMatchListeners();
  useTournamentListeners();

  return page;
};
