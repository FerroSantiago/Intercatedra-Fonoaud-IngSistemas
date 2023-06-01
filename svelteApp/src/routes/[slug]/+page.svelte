<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Header from "../../components/Header.svelte";
    import { syllable } from "syllable";
    import "../../styles.css"

    let paciente = {
        nombre: "",
        edad: 0,
        direccion: "",
        email: "",
        arrayDeTextos: [""],
        arrayDeErrores: [],
        _id: "",
    };
    let texto = "";
    let error = 0;

    onMount(async () => {
        getPaciente();
    });

    async function getPaciente() {
        const id = $page.params.slug;
        const res = await fetch(`http://localhost:3000/paciente/${id}`, {
            method: "GET",
        });
        paciente = await res.json();
    }
    async function pushTexto() {
        // Agregar el valor del input al array de textos
        paciente.arrayDeTextos.push(texto);
        paciente.arrayDeErrores.push(error);

        // Actualizar el paciente en la API
        const updateRes = await fetch("http://localhost:3000/paciente", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(paciente),
        });

        const updatedPaciente = await updateRes.json();
        console.log(updatedPaciente); // Mostrar la respuesta de la API en la consola
        clearInput();
        getPaciente();
    }
    function clearInput() {
        texto = "";
    }

    async function updateError(index) {
        paciente.arrayDeErrores[index] = parseFloat(
            paciente.arrayDeErrores[index]
        );

        const updateRes = await fetch("http://localhost:3000/paciente", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: paciente._id,
                arrayDeErrores: paciente.arrayDeErrores,
            }),
        });

        const updatedPaciente = await updateRes.json();
        console.log(updatedPaciente); // Mostrar la respuesta de la API en la consola
    }

    function contarSilabas(index) {
        const textoItem = paciente.arrayDeTextos[index];
        let errores = paciente.arrayDeErrores[index];
        updateError(index);

        if (textoItem) {
            const numeroSilabas = contarSilabasEnTexto(textoItem);
            const resultado = (errores * 100) / numeroSilabas;
            console.log("Número de sílabas:", numeroSilabas);
            console.log("Porcentaje Tz:", resultado);

            paciente.arrayDeTextos[index] = `${
                textoItem.split("Resultado:")[0]
            } Resultado: ${resultado.toFixed(2)}`;
        } else {
            console.log("El texto está vacío");
        }
    }
    function contarSilabasEnTexto(texto) {
        if (typeof texto === "string") {
            // Utilizar la biblioteca syllable para contar las sílabas
            const numeroSilabas = syllable(texto);
            return numeroSilabas;
        } else {
            console.log("El texto no es una cadena de texto");
            return 0;
        }
    }
</script>

<head>
    <title>{paciente.nombre}</title>
</head>

<header>
    <Header />
</header>

<div class="page">
    <div class="row">
        <div class="col">
            <h1>Paciente: {paciente.nombre}</h1>
            <h4>Edad: {paciente.edad}</h4>
            <h4>Direccion: {paciente.direccion}</h4>
            <h4>E-Mail: {paciente.email}</h4>
        </div>

        <div class="col">
            <div class="botoneraTexto">
                <h2>Textos</h2>
                <button
                    type="button"
                    class="btn btn-primary"
                    style="margin-right:1em"
                    on:click={pushTexto}
                >
                    Añadir texto...
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-plus-circle-fill"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
                        />
                    </svg>
                </button>
                <textarea bind:value={texto} id="" cols="30" rows="10" />
            </div>
        </div>
    </div>

    <div class="contenedorCajas">
        {#each paciente.arrayDeTextos as textoItem, i}
            {#if textoItem != ""}
                <div class="caja">
                    <p>{textoItem.split("Resultado:")[0]}</p>
                    <div class="err">
                        <label for="err"
                            >Errores cometidos: {paciente.arrayDeErrores[
                                i
                            ]}</label
                        >
                        <input
                            bind:value={paciente.arrayDeErrores[i]}
                            type="err"
                        />
                        <button
                            class="btn btn-success"
                            on:click={() => contarSilabas(i)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-arrow-bar-up"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"
                                />
                            </svg>
                        </button>
                        {#if paciente.arrayDeTextos[i].includes("Resultado:")}
                            <p style="magrin-left:1em">
                                Tartamudez: {parseFloat(
                                    paciente.arrayDeTextos[i].split(
                                        "Resultado:"
                                    )[1]
                                ).toFixed(2)}%
                            </p>
                        {/if}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    .page{
        margin-left: 2em;
    }
    .botoneraTexto {
        display: flex;
    }
    .col {
        margin-top: 2em;
    }
    h2 {
        margin-right: 0.25em;
    }
    textarea {
        width: 400px;
        height: 150px;
        text-align: top;
        overflow: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        border-radius: 10px;
        border-width: 1px;
        resize: none;
    }
    input {
        height: 30px;
        width: 30px;
    }
    button {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .contenedorCajas {
        display: flex;
        flex-direction: row;
        justify-content: center;
        text-align: left;
    }
    .caja {
        display: grid;
        background-color: #ffffff;
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 10px;
        width: 400px;
        margin: 1em;
    }
    .err {
        display: flex;
    }
    .err label {
        margin-right: 10px;
    }
    .err input {
        width: 30px;
        margin-right: 10px;
        border-radius: 5px;
        border-width: 1px;
    }
    .err button {
        display: flex;
        align-items: center;
    }
</style>
