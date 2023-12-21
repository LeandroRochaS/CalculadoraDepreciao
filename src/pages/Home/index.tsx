import { useState } from "react";
import { useRef } from "react";
import { utils, writeFileXLSX } from "xlsx";
import Navbar from "../../components/NavBar";
import "./style.scss";
import { exportTableToPdf } from "../../scripts/tabela";
import excelIcon from "../../assets/svgs/icons8-excel.svg";
import pdfIcon from "../../assets/svgs/pdf-file-2-svgrepo-com.svg";

interface TableData {
  ano: number;
  valorContabilInicial: number;
  porcentagemDepreciacao: number;
  montanteDepreciacao: number;
  montanteDepreciacaoAcumulada: number;
  valorContabilFinal: number;
}

export default function Home() {
  const [resultData, setResultData] = useState<TableData[]>([]);
  const tbl = useRef(null);

  function calcular() {
    console.log("Calculando");
    const valorNovo = parseFloat(
      (document.getElementById("valorNovo") as HTMLInputElement)?.value || "0"
    );
    const valorResidual = parseFloat(
      (document.getElementById("valorResidual") as HTMLInputElement)?.value ||
        "0"
    );
    const anosDepre = parseInt(
      (document.getElementById("anosDepre") as HTMLInputElement)?.value || "0",
      10
    );
    const metodo = parseInt(
      (document.getElementById("metodo") as HTMLInputElement)?.value || "0",
      10
    );

    if (
      valorNovo === 0 ||
      valorResidual === 0 ||
      anosDepre === 0 ||
      metodo === 0
    ) {
      exibirErro("calcularBtn", "Preencha todos os campos corretamente");
      return;
    } else {
      ocultarErro("calcularBtn");
    }

    const data: TableData[] = [];
    let valorContabilInicial = valorNovo;
    const taxaDepreciacao = 100 / anosDepre;

    for (let ano = 1; ano <= anosDepre; ano++) {
      const montanteDepreciacao =
        metodo === 1
          ? (valorContabilInicial - valorResidual) / anosDepre
          : valorContabilInicial * (taxaDepreciacao / 100);

      const montanteDepreciacaoAcumulada =
        ano === 1
          ? montanteDepreciacao
          : data[ano - 2].montanteDepreciacaoAcumulada + montanteDepreciacao;
      const valorContabilFinal = valorContabilInicial - montanteDepreciacao;

      data.push({
        ano,
        valorContabilInicial,
        porcentagemDepreciacao: taxaDepreciacao,
        montanteDepreciacao,
        montanteDepreciacaoAcumulada,
        valorContabilFinal,
      });

      valorContabilInicial = valorContabilFinal;
    }

    setResultData(data);
  }

  function exibirErro(idElemento: string, mensagem: string) {
    const elemento = document.getElementById(idElemento) as HTMLElement | null;
    if (elemento) elemento.style.border = "1px solid red";

    // Adiciona ou atualiza uma mensagem de erro
    let errorElement = document.getElementById(idElemento + "Error");
    if (!errorElement) {
      errorElement = document.createElement("p");
      errorElement.classList.add("error");
      errorElement.id = idElemento + "Error";

      if (elemento && elemento.parentNode) {
        elemento.parentNode.appendChild(errorElement);
      }
    }

    errorElement.innerText = mensagem;
  }

  function ocultarErro(idElemento: string) {
    const elemento = document.getElementById(idElemento);
    if (elemento) elemento.style.border = "1px solid #ccc";

    // Remove a mensagem de erro se existir
    const errorElement = document.getElementById(idElemento + "Error");
    if (errorElement) {
      errorElement.remove();
    }
  }

  function exportTableToExcel() {
    const wb = utils.table_to_book(tbl.current);
    writeFileXLSX(wb, "SheetJSReactExport.xlsx");
  }

  return (
    <>
      <body>
        <Navbar />

        <section className="container">
          <div className="twoCards">
            <div className="card">
              <div className="card-container-text">
                <h3>Valor Novo</h3>
                <p>Valor do equipamento novo</p>
              </div>
              <div>
                <input id="valorNovo" type="text" />
              </div>
              <div>
                <hr />
              </div>
            </div>
            <div className="card">
              <div className="card-container-text">
                <h3>Valor Residual</h3>
                <p>valor restante desse ativo após esse tempo de uso</p>
              </div>
              <div>
                <input id="valorResidual" type="text" />
              </div>
              <div>
                <hr />
              </div>
            </div>
          </div>
          <div className="twoCards">
            <div className="card">
              <div className="card-container-text">
                <h3>Anos Depreciação</h3>
                <p>Vida útil do item</p>
              </div>
              <div>
                <input id="anosDepre" type="text" />
              </div>
              <div>
                <hr />
              </div>
            </div>
            <div className="card">
              <div className="card-container-text">
                <h3>Método</h3>
                <p>Método de calculo</p>
              </div>
              <div>
                <select id="metodo">
                  <option value="0">Selecione</option>
                  <option value="1">Método Linear</option>
                  <option value="2">Método de Saldo Decrescente</option>
                </select>
              </div>
              <div>
                <hr />
              </div>
            </div>
          </div>
          <button className="calcularBtn" onClick={calcular}>
            Calcular
          </button>
          <div className="result-container">
            <div className="card-result">
              <div className="titleResult">
                <h2>Resultado do Cálculo</h2>
                <div className="buttonExport">
                  <button
                    onClick={() => {
                      exportTableToExcel();
                    }}
                    className="exportarBtn"
                  >
                    <img src={excelIcon} alt="excel icon" />
                  </button>
                  <button
                    onClick={() => {
                      const table = document.getElementById(
                        "table"
                      ) as HTMLTableElement | null;
                      if (table) {
                        exportTableToPdf(table);
                      }
                    }}
                    className="exportarBtn"
                  >
                    <img src={pdfIcon} alt="pdf icon" />
                  </button>
                </div>
              </div>

              <table id="table" ref={tbl} className="tabela-resultado">
                <thead>
                  <tr>
                    <th>Ano</th>
                    <th>Valor Contábil Inicial</th>
                    <th>Porcentagem de Depreciação</th>
                    <th>Montante de Depreciação</th>
                    <th>Montante de Depreciação Acumulada</th>
                    <th>Valor Contábil Final</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((item) => (
                    <tr key={item.ano}>
                      <td>{item.ano}</td>
                      <td>${item.valorContabilInicial.toFixed(2)}</td>
                      <td>{item.porcentagemDepreciacao.toFixed(2)}%</td>
                      <td>${item.montanteDepreciacao.toFixed(2)}</td>
                      <td>${item.montanteDepreciacaoAcumulada.toFixed(2)}</td>
                      <td>${item.valorContabilFinal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </body>
    </>
  );
}
