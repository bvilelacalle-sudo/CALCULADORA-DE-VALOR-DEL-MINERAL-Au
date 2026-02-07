const form = document.getElementById("calculator-form");
const resultsBody = document.getElementById("results-body");
const resetButton = document.getElementById("reset");

const formatNumber = (value) =>
  new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const fields = [
  { id: "tmh", label: "TMH (peso húmedo)", formatter: formatNumber },
  { id: "h2o", label: "% H2O", formatter: formatNumber },
  { id: "ley-au", label: "Ley Au (oz/tc)", formatter: formatNumber },
  { id: "recuperacion", label: "% Recuperación Au", formatter: formatNumber },
  { id: "maquila", label: "Maquila (US$/tc)", formatter: formatCurrency },
  { id: "rc", label: "R.C. (US$/oz)", formatter: formatCurrency },
  {
    id: "reactivos",
    label: "Consumo de reactivos (US$/tc)",
    formatter: formatCurrency,
  },
  {
    id: "inter",
    label: "Precio internacional del oro (INTER) (US$/oz)",
    formatter: formatCurrency,
  },
];

const renderRows = (rows) => {
  resultsBody.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td>${row.label}</td>
        <td class="${row.highlight ? "highlight" : ""}">${row.value}</td>
      </tr>
    `
    )
    .join("");
};

const showPlaceholder = () => {
  resultsBody.innerHTML =
    '<tr><td colspan="2" class="placeholder">Ingresa los datos y presiona “Calcular”.</td></tr>';
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = fields.reduce((acc, field) => {
    acc[field.id] = Number(document.getElementById(field.id).value || 0);
    return acc;
  }, {});

  const tms = values.tmh * (1 - values.h2o / 100);
  const precioUnitario =
    (values["ley-au"] *
      (values.recuperacion / 100) *
      (values.inter - values.rc) -
      values.maquila -
      values.reactivos) *
    1.1023;

  const subtotal = tms * precioUnitario;
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const rows = [
    ...fields.map((field) => ({
      label: field.label,
      value: field.formatter(values[field.id]),
    })),
    { label: "TMS", value: formatNumber(tms), highlight: true },
    {
      label: "Precio unitario del lote",
      value: formatCurrency(precioUnitario),
      highlight: true,
    },
    { label: "SUBTOTAL", value: formatCurrency(subtotal), highlight: true },
    { label: "IGV (18%)", value: formatCurrency(igv), highlight: true },
    { label: "TOTAL", value: formatCurrency(total), highlight: true },
  ];

  renderRows(rows);
});

resetButton.addEventListener("click", () => {
  showPlaceholder();
});

showPlaceholder();
