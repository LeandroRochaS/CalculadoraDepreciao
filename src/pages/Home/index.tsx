import { useState } from "react";
import { useRef } from "react";
import { utils, writeFileXLSX } from "xlsx";
import Navbar from "../../components/NavBar";
import "./style.scss";
import { limparInputs, validaInputs } from "../../scripts/validation";
import { dataHorarioNow, exportTableToPdf } from "../../scripts/tabela";
import excelIcon from "../../assets/svgs/icons8-excel.svg";
import pdfIcon from "../../assets/svgs/pdf-file-2-svgrepo-com.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    validaInputs();
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
      toastError();
      return;
    } else {
      toastSucess();
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

  function toastSucess() {
    toast.success("Calculado com Sucesso !", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  function toastError() {
    toast.error("Dados inválidos", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  function exportTableToExcel() {
    const wb = utils.table_to_book(tbl.current);
    (wb.Props = {
      Title: "Relatório de Depreciação",
      Subject: "Relatório de Depreciação",
    }),
      writeFileXLSX(wb, `RelatorioDepreciacao-${dataHorarioNow()}.xlsx`);
  }

  return (
    <>
      <section className="bodyContent">
        <Navbar />
        <section className="container">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

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
          <button className="LimparBtn" onClick={limparInputs}>
            Limpar
          </button>
          <div className="result-container">
            <div className="card-result">
              <div className="titleResult">
                <h2>Resultado do Cálculo</h2>
                <div className="buttonExport">
                  <button
                    onClick={() => {
                      if (resultData.length > 0) exportTableToExcel();
                      else console.log("Não foi possível exportar");
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
                      if (resultData.length > 0 && table !== null) {
                        exportTableToPdf(table);
                      } else {
                        console.log("Não foi possível exportar");
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
      </section>
    </>
  );
}
