prompt datos: 

generame un dataset de acuerdo a la siguiente estructura:

- Customer ID:

- name:

- email:

- product purchased:

- purchase date:

- amount spent:

- age:

- city:

- payment method:

- last login date:

- membership status:


- ejemplo:
CUST__001, nat Doe, nat@example.com, hamburguesa, 2023-10-12, 2500, 25, china, Credit Card, activa. Aprox 8000 registros. Validando todo el dataset con esto: ● Números: ¿Edades entre 13 y 100? ¿Montos >= 0?

 ● Fechas: ¿Formato ISO YYYY-MM-DD? ¿Es la fecha de compra anterior o igual al último inicio de
sesión? (Evitar fechas futuras).

 ● Categorías: ¿Valores normalizados (ej. "Credit Card" y no "credit card")?

 ● Unicidad: ¿IDs únicos sin duplicados?

 ● Valida que los productPurchased sean comidas rapidas(hamburguesa,perro,salchipapa etc)

 ● Valida que el amountSpent sea de 4 digitos o 6 digitos 

 ● Valida que city solo sean de Colombia 

 ● Valida que el payment method solo sea Credit Card y Paypal

 ● Coherencia Cruzada: ¿Correos con dominio seguro (example.com)? ¿Ciudad coherente con el
catálogo? Validado el dataset, este se convierte en el combustible para la interfaz que diseñaremos a continuación.

prompt pagina: 

- ● Fondo: Oscuro  (#1E1E1E) para una estética tecnológica y moderna.

- ● Tipografía: Playfair Display (limpia y legible para datos numéricos).

- ● Color de Acento:#D8E2DC (verde grisáceo suave)
  
#FFE5D9 (rosado claro cálido)

#FFCAD4 (rosado pastel)

#F4ACB7 (rosado medio)

#9D8189 (morado grisáceo), para botones y llamadas a la acción.


- ● Navegación: Menú responsivo que se transforme en sistema "hamburguesa" en móviles.

- ● Arquitectura de Código: Es vital solicitar código segregado (archivos independientes para HTML, CSS y

JS). Esta separación técnica facilita la inyección dinámica de los datos de Firebase sin comprometer la

estructura visual. Un diseño bien estructurado en contenedores facilita la conexión dinámica de datos.
