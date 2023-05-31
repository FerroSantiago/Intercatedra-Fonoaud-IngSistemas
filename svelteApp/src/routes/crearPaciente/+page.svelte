<script>
    import { onMount } from "svelte";
    import Header from "../../components/Header.svelte";
    import "../../styles.css";

    let APIURL = "https://intercatedra-fonoaud-ing-sistemas.vercel.app/paciente";
    let listaPacientes = [
        {
            nombre: "",
            edad: 0,
            direccion: "",
            email: "",
            arrayDeTextos: [],
            arrayDeErrores: [],
            _id: "",
        },
    ];
    let nombre = "";
    let edad = "";
    let direccion = "";
    let email = "";
    let arrayDeTextos = [""];
    let arrayDeErrores = [0];

    onMount(() => {
        getPacientes();
    });

    async function getPacientes() {
        const res = await fetch(APIURL);
        const pacientes = await res.json();
        listaPacientes = pacientes;
    }
    async function addPaciente() {
        let obj = {
            nombre,
            edad,
            direccion,
            email,
            arrayDeTextos,
            arrayDeErrores,
        };
        const res = await fetch(APIURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });
        console.log(await res.json());
        getPacientes();
        clearInputs();
    }
    function clearInputs() {
        nombre = "";
        edad = "";
        direccion = "";
        email = "";
    }
    async function deletePaciente(id) {
        const res = await fetch(APIURL + `/${id}`, { method: "DELETE" });
        console.log(await res.json());
        getPacientes();
    }
</script>

<head>
    <title>Administración</title>
</head>

<header>
    <Header />
</header>

<div class="page">
    <div class="contenedorCreacion">
        <div class="form-group">
            <input
                type="text"
                id="nombre"
                placeholder="..."
                bind:value={nombre}
            />
            <label for="nombre">Nombre</label>
        </div>
        <div class="form-group">
            <input
                type="text"
                id="edad"
                placeholder="..."
                bind:value={edad}
            />
            <label for="edad">Edad</label>
        </div>
        <div class="form-group">
            <input
                type="text"
                id="direccion"
                placeholder="..."
                bind:value={direccion}
            />
            <label for="direccion">Direccion</label>
        </div>
        <div class="form-group">
            <input 
                type="text"
                id="email"
                placeholder="..."
                bind:value={email}
            />
            <label for="email">E-Mail</label>
        </div>

        <div class="centrado">
            <button class="btn btn-success" on:click={addPaciente}>
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
                Crear paciente
            </button>
        </div>
    </div>

    <div class="contenedorPacientes">
        {#each listaPacientes as paciente}
            <div>
                <button
                    class="btn btn-primary"
                    on:click={deletePaciente(paciente._id)}
                >
                    Eliminar {paciente.nombre}</button
                >
            </div>
        {:else}
            <p>Sin respuesta</p>
        {/each}
    </div>
</div>

<style>
    .page {
        margin-top: 2em;
        display: grid;
        justify-content: center;
    }
    .contenedorCreacion {
        border: 1px solid #ccc;
        background-color: #fafafa;
        width: fit-content;
        padding: 1em;
        border-radius: 10px;
        display: grid;
    }
    .contenedorPacientes {
        width: auto;
        text-align: center;
        padding-top: 2em;
        padding-bottom: 2em;
    }
    .centrado {
        text-align: center;
    }
    button {
        margin-top: 1em;
        display: inline-block;
    }
    .btn-primary:hover {
        background-color: rgb(252, 61, 61);
    }
    input {
        width: 300px;
        height: 40px;
        border: 1px solid #cacaca;
    }
    .form-group {
        position: relative;
        margin-bottom: 2rem;
    }
    .form-group label {
        position: absolute;
        top: 0;
        left: 0.5em;
        font-size: 0.8rem;
        transition: all 0.2s ease-in-out;
    }
    .form-group input:focus + label,
    .form-group input:not(:placeholder-shown) + label {
        top: -1rem;
        left: 0;
        font-size: 0.6rem;
    }
</style>
