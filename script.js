document.getElementById("usuariosP").addEventListener("change", function() {
    document.getElementById("codigoSucursalGroup").style.display = this.checked ? "block" : "none";
});

function generateSQL() {
    const idUsuarioPrivado = document.getElementById("idUsuarioPrivado").value;
    const cedula = document.getElementById("cedula").value;
    const primerNombre = document.getElementById("primerNombre").value.toUpperCase();
    const segundoNombre = document.getElementById("segundoNombre").value.toUpperCase();
    const primerApellido = document.getElementById("primerApellido").value.toUpperCase();
    const segundoApellido = document.getElementById("segundoApellido").value.toUpperCase();
    const email = document.getElementById("email").value;
    const usuario = document.getElementById("usuario").value;
    let idUsuarioRegional = parseInt(document.getElementById("idUsuarioRegional").value);
    const idUsuarioRol = document.getElementById("idUsuarioRol").value;
    const idRol = document.getElementById("idRol").value;

    const usuarioCreacion = document.querySelector('input[name="usuarioCreacion"]:checked');
    if (!usuarioCreacion) {
        alert("Debes seleccionar un usuario de creación.");
        return;
    }

    const insertUser = `-- CREAR USUARIO\ninsert into usuarios.usuarioprivado 
    (idusuarioprivado, idtipousuario, numerodocumento, primernombre, segundonombre, primerapellido, segundoapellido, usuario, "password", email, habilitado, usuariocreacion, fechacreacion, contestapqrs) 
    values (${idUsuarioPrivado}, 1, ${cedula}, '${primerNombre}', '${segundoNombre}', '${primerApellido}', '${segundoApellido}', '${usuario}', '${cedula}', '${email}', true, '${usuarioCreacion.value}', current_timestamp, false);`;

    let sqlQueries = [insertUser];

    if (document.getElementById("usuariosP").checked) {
        const codigoSucursal = document.getElementById("codigoSucursal").value;
        const insertUsuarioP = `-- USUARIOSP\ninsert into usuariosp
        (codigousuario, nombresapellidos, dispositivoimp, codigosucursal, habilitado, nitcliente, iddepartamento, email)
        values ('${usuario}', '${primerNombre.charAt(0) + primerNombre.slice(1).toLowerCase()} ${segundoNombre.charAt(0) + segundoNombre.slice(1).toLowerCase()} ${primerApellido.charAt(0) + primerApellido.slice(1).toLowerCase()} ${segundoApellido.charAt(0) + segundoApellido.slice(1).toLowerCase()}', '', ${codigoSucursal}, TRUE, 0, 0, '${email}');`;
        sqlQueries.push(insertUsuarioP);
    }

    const regionales = [
        { id: 1, name: "CALI" },
        { id: 2, name: "BOGOTA" },
        { id: 3, name: "PEREIRA" },
        { id: 4, name: "BARRANQUILLA" },
        { id: 5, name: "MEDELLIN" },
        { id: 6, name: "IBAGUE" },
        { id: 7, name: "BUCARAMANGA" }
    ];

    regionales.forEach(regional => {
        if (document.getElementById(`regional${regional.id}`).checked) {
            const insertRegional = `-- REGIONALES\ninsert into usuarios.usuarioregionales 
            (idusuarioregional, idusuario, idregional, nombre, habilitado, usuariocreacion, fechacreacion)
            values (${idUsuarioRegional}, ${idUsuarioPrivado}, ${regional.id}, '${regional.name}', true, '${usuarioCreacion.value}', current_timestamp);`;
            sqlQueries.push(insertRegional);
            idUsuarioRegional++;
        }
    });

    const insertRol = `-- ROL\ninsert into usuarios.usuariosrol 
    (idusuariorol, idusuario, idrol) 
    values (${idUsuarioRol}, ${idUsuarioPrivado}, ${idRol});`;
    sqlQueries.push(insertRol);

    document.getElementById("sqlOutput").innerText = sqlQueries.join("\n\n");
}
