const initialUsers = require("./src/utilities/initUsers");
const postRegister = require("./src/controllers/User/postRegister");


async function insertUsers() {
    try {
        let resultados = [];
        for (const userData of initialUsers) {
            const req = { body: userData };
            const res = {
                status: (code) => ({
                    json: (data) => {
                        resultados.push({ code, data });
                    },
                }),
            };
            const newUser = await postRegister(req, res);
        }
        if (resultados.length) {
            console.log("Usuarios insertados con éxito.");
        }
        else throw Error('LA CARGA DE USUARIOS INICIALES FALLÓ');
    } catch (error) {
        console.error(`Error al insertar usuarios: ${error.message}`);
    }
}

insertUsers();
