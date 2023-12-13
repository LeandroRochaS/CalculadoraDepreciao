import Navbar from "../../components/NavBar";
import "./style.scss";

export default function Home() {
  function calcular() {
    console.log("Calculando");
    const inputs = document.querySelectorAll("input");
    const selects = document.querySelectorAll("select");
    const campos = [...inputs, ...selects];
    campos.forEach((input) => {
      console.log(input.value);

      if (
        input.value === "" ||
        input.value === "0" ||
        input.value === "Selecione"
      ) {
        exibirErro(input.id, "Campo obrigatório");
      } else {
        ocultarErro(input.id);
      }
    });
  }

  function exibirErro(idElemento: string, mensagem: string) {
    const elemento = document.getElementById(idElemento) as HTMLElement | null;
    if (elemento) elemento.style.border = "1px solid red";

    console.log(elemento);

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
            <div className="card card-result">
              <h2>Test</h2>
            </div>
          </div>
        </section>
      </body>
    </>
  );
}
