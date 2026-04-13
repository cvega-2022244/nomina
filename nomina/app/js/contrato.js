// Obtener el objeto almacenado en sessionStorage
const informacion = JSON.parse(sessionStorage.getItem("informacion"));

// Obtener el elemento <p> con id "contenido"
    const elementoContenido = document.getElementById("contenido");

    // Texto del contrato con placeholders
    const textoContrato =
    `En la ciudad de Guatemala, ${informacion.fecha_actual}, YO, ${informacion.nombre_completo}, de
    ${informacion.edad_2}, ${informacion.nacionalidad}, ${informacion.estado_civil}, con domicilio en
    ${informacion.domicilio}, quien se identifica con el Documento personal de identificación (DPI) código único de
    identificación (CUI) ${informacion.dpi_2} (${informacion.dpi}) extendido por el Registro Nacional de las Personas de
    la república de Guatemala, quien actúo en su calidad de Presidente del Consejo de Administración y Representante
    Legal de la entidad denominada ${informacion.nombre_empresa} calidad que acredita con el acta notarial de
    nombramiento, autorizada en la ciudad de Guatemala, el día ${informacion.fecha_acta} por la persona
    ${informacion.nombre_notario}, la cual se encuentra debidamente inscrita en el Registro Mercantil General de la
    República de Guatemala al número ${informacion.registro_mercantil}, folio (${informacion.folio_2}) (${informacion.folio})
    del libro ${informacion.libro_2} (${informacion.libro}) de Auxiliares de Comercio de Auxiliares de Comercio y por la
    otra parte… Manifiesto ser de las generales antes indicadas, que me encuentro en el libre ejercicio de mis derechos
    civiles, y que por medio del presente documento hago constar lo siguiente. PRIMERO: Yo,
    ${informacion.nombre_completo} quien me identifico con el Documento personal de identificación (DPI) código único de
    identificación (CUI) ${informacion.dpi_2} (${informacion.dpi}) extendido por el Registro Nacional de las Personas de
    la república de Guatemala manifiesto que laboro en la entidad ${informacion.nombre_empresa}, de nombre comercial
    ${informacion.nombre_empresa}, como ${informacion.puesto} en el Depto. ${informacion.departamento_laboral} o en su
    defecto el cargo al cual se la haya promovido. SEGUNDO. Continúo manifestando que dada la naturaleza del cargo que
    desempeño tengo acceso a diversa información vinculada con la actividad comercial de UNION HERMANOS SOCIEDAD
    ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA, ECONACIONAL SOCIEDAD ANÓNIMA, FRAGANCIAS FINAS SOCIEDAD ANÓNIMA, CALIDUL
    SOCIEDAD ANÓNIMA, CLEARTEC SOCIEDAD ANÓNIMA, y en ese sentido me comprometo: I) A guardar estricta confidencialidad
    a favor de UNION HERMANOS SOCIEDAD ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA,, ECONACIONAL SOCIEDAD ANÓNIMA,, FRAGANCIAS
    FINAS SOCIEDAD ANÓNIMA,, CALIDUL SOCIEDAD ANÓNIMA,, CLEARTEC SOCIEDAD ANÓNIMA, Sociedad Anónima, en todos los
    documentos que me son proporcionados. Dicha confidencialidad estará vigente durante el tiempo que labore para
    ${informacion.nombre_empresa} y por CINCO AÑOS después de concluida mi relación laboral con dicha entidad; II) Me
    comprometo a no extraer, ni permitir que persona alguna, saque notas, FORMULAS, fotocopias o duplicados de los
    documentos que me han sido confiados a mi custodia o mi cargo, III) No hacer comunicación verbal, telefónica, correo
    electrónico o de otra naturaleza a personas ajenas a UNION HERMANOS SOCIEDAD ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA,
    ECONACIONAL SOCIEDAD ANÓNIMA, FRAGANCIAS FINAS SOCIEDAD ANÓNIMA, CALIDUL SOCIEDAD ANÓNIMA, CLEARTEC SOCIEDAD
    ANÓNIMA, del contenido de la información que me es suministrada con ocasión de la relación de trabajo con dicha
    entidad. IV) No hacer comunicación verbal, telefónica, correo electrónico o de otra naturaleza a personas ajenas a
    UNION HERMANOS SOCIEDAD ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA, ECONACIONAL SOCIEDAD ANÓNIMA, FRAGANCIAS FINAS SOCIEDAD
    ANÓNIMA, CALIDUL SOCIEDAD ANÓNIMA, CLEARTEC SOCIEDAD ANÓNIMA, del contenido de la información que me es suministrada
    y relacionada a eventos, promociones, descuentos, actividades de lanzamiento de nuevos productos, a no hacer uso
    para sí mismo y para otras empresas o personas particulares las bases de datos de clientes, proveedores y cualquier
    información que involucre a UNION HERMANOS, SOCIEDAD ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA, ECONACIONAL SOCIEDAD
    ANÓNIMA, FRAGANCIAS FINAS SOCIEDAD ANÓNIMA, CALIDUL SOCIEDAD ANÓNIMA, CLEARTEC SOCIEDAD ANÓNIMA, costos y detalles
    de cualquiera de los productos comercializados por UNION HERMANOS, SOCIEDAD ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA,
    ECONACIONAL SOCIEDAD ANÓNIMA, FRAGANCIAS FINAS SOCIEDAD ANÓNIMA, CALIDUL SOCIEDAD ANÓNIMA, CLEARTEC SOCIEDAD
    ANÓNIMA, IV) Me comprometo por medio de este contrato a no hacer USO, COMERCIALIZACION, DIVULGACION o cualquier tipo
    de negociación con ninguna persona ya sea de la competencia o particular sobre todas las formulas, conocimientos
    adquiridos dentro de UNION HERMANOS SOCIEDAD ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA, ECONACIONAL SOCIEDAD ANÓNIMA,
    FRAGANCIAS FINAS SOCIEDAD ANÓNIMA, CALIDUL SOCIEDAD ANÓNIMA, CLEARTEC SOCIEDAD ANÓNIMA, a las cuales yo tuve acceso
    en el desempeño laboral dentro de UNION HERMANOS SOCIEDAD ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA, ECONACIONAL SOCIEDAD
    ANÓNIMA, FRAGANCIAS FINAS SOCIEDAD ANÓNIMA, CALIDUL SOCIEDAD ANÓNIMA, CLEARTEC SOCIEDAD ANÓNIMA, o cualquier otra
    empresa que pertenezca al grupo de empresas que estén relacionadas con el desempeño de mis labores. V) Me comprometo
    a no iniciar ningún tipo de negocio, empresa, sociedad, que sea competencia directa o indirecta para UNION HERMANOS
    SOCIEDAD ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA, ECONACIONAL SOCIEDAD ANÓNIMA, FRAGANCIAS FINAS SOCIEDAD ANÓNIMA,
    CALIDUL SOCIEDAD ANÓNIMA, CLEARTEC SOCIEDAD ANÓNIMA, durante los CINCO AÑOS siguientes de haber laborado para UNION
    HERMANOS SOCIEDAD ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA, ECONACIONAL SOCIEDAD ANÓNIMA, FRAGANCIAS FINAS SOCIEDAD
    ANÓNIMA, CALIDUL SOCIEDAD ANÓNIMA, CLEARTEC SOCIEDAD ANÓNIMA, ya que sería una COMPETENCIA DESLEAL que se encuentra
    regulada en las ley Guatemalteca. VI) Reconozco, que todas las fórmulas son propiedad de UNION HERMANOS, SOCIEDAD
    ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA, ECONACIONAL SOCIEDAD ANÓNIMA, FRAGANCIAS FINAS SOCIEDAD ANÓNIMA, CALIDUL
    SOCIEDAD ANÓNIMA, CLEARTEC SOCIEDAD ANÓNIMA, y las empresas que sean creadas a futuro por el mismo grupo, dichas
    fórmulas no pueden ser usadas por mi persona de por vida, y reconozco que puedo ser demandado de forma económica por
    un valor mínimo inicial de Q. 5,000.00 (cinco mil quetzales exactos) por DAÑOS Y PERJUICIOS por la empresa UNION
    HERMANOS SOCIEDAD ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA,, ECONACIONAL SOCIEDAD ANÓNIMA, FRAGANCIAS FINAS SOCIEDAD
    ANÓNIMA,, CALIDUL SOCIEDAD ANÓNIMA,, CLEARTEC SOCIEDAD ANÓNIMA, basados en el CODIGO DE TRABAJO artículo 77 inciso
    e) que reza literalmente “Cuando el trabajador revele los secretos a los que alude el inciso g) del Artículo 63 y el
    cual reza así. Artículo 63 inciso g) Obligaciones de los trabajadores “Guardar los secretos técnicos, comerciales o
    de fabricación de los productos a cuya elaboración concurran directa o indirectamente con tanta más fidelidad cuanto
    más alto sea el cargo del trabajador o la responsabilidad que tenga de guardarlos por la razón de la ocupación que
    desempeña; así como los asuntos administrativos reservados, cuya divulgación pueda causar perjuicio a la empresa”.
    VII) Renuncio al fuero de mi domicilio y me someto a los tribunales de Guatemala que UNION HERMANOS SOCIEDAD
    ANÓNIMA, PROQUIMA SOCIEDAD ANÓNIMA, ECONACIONAL SOCIEDAD ANÓNIMA, FRAGANCIAS FINAS SOCIEDAD ANÓNIMA, CALIDUL
    SOCIEDAD ANÓNIMA, CLEARTEC SOCIEDAD ANÓNIMA, Crea necesarios por no haber cumplido con todo lo estipulado en este
    contrato TERCERO. ACEPTACIÓN. Yo, ${informacion.nombre_completo} manifiesto que en los términos relacionados, acepto
    el contenido de todas y cada una de las cláusulas del presente instrumento y me sujeto a las consecuencias legales
    que mi inobservancia del mismo conlleve, que lo leí íntegramente y enterado de su contenido, objeto, valor y demás
    efectos legales, lo ratifico acepto y firmo. En la ciudad de Guatemala, el día veinticuatro de julio del dos mil
    veintitrés, como Notario DOY FE: Que las firmas que anteceden, son auténticas por haber sido puestas en mi presencia
    el día de hoy por: ${informacion.nombre_empleado} quien se me identifica con el Documento personal de identificación
    (DPI) código único de identificación (CUI) ${informacion.dpi_2} (${informacion.dpi}) extendido por el Registro
    Nacional de las Personas de la República de Guatemala, y ${informacion.nombre_completo} quien por no ser persona de
    mi anterior conocimiento, se me identifica con el Documento personal de identificación (DPI) código único de
    identificación (CUI) ${informacion.dpi_2} (${informacion.dpi}) extendido por el Registro Nacional de las Personas de
    la República de Guatemala, quienes firman conmigo la presente acta de legalización que calza al pie de documento
    privado contenido en una hoja de papel bond útil en su anverso y reverso que sello y firmo.`;

    // Asignar el texto al contenido del elemento
    elementoContenido.textContent = textoContrato;