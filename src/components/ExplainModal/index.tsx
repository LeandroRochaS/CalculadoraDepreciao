import { useState } from "react";
import "./style.scss";
import iconTable from "../../assets/png/icons8-table-properties-32 (1).png";
import iconClose from "../../assets/svgs/close.svg";

export default function ExplainModal() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button className="openModal" onClick={openModal}>
        <img src={iconTable} alt="icon table properties" />
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="closeModal" onClick={closeModal}>
              <img src={iconClose} alt="icon close" />
            </button>

            <h3>Explicação - Tabela de Depreciação</h3>
            <p>
              A tabela abaixo apresenta informações sobre a depreciação de
              ativos ao longo do tempo. Cada linha representa um ano e inclui os
              seguintes dados:
            </p>
            <ul>
              <li>
                <strong>Ano:</strong> O ano correspondente.
              </li>
              <li>
                <strong>Valor Contábil Inicial:</strong> O valor do ativo no
                início do ano.
              </li>
              <li>
                <strong>Porcentagem de Depreciação:</strong> A taxa de
                depreciação aplicada ao valor contábil inicial.
              </li>
              <li>
                <strong>Montante de Depreciação:</strong> A quantidade
                depreciada durante o ano.
              </li>
              <li>
                <strong>Montante de Depreciação Acumulada:</strong> A quantidade
                total depreciada até o ano atual.
              </li>
              <li>
                <strong>Valor Contábil Final:</strong> O valor do ativo no final
                do ano após a depreciação.
              </li>
            </ul>
            <p>
              Utilize esses dados para entender como o valor do ativo evolui ao
              longo do tempo devido à depreciação.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
