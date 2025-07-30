import { gql } from "@apollo/client";

export const EXPORT_PDF = gql`
  mutation ExportPdf($html: String!, $margin: MarginInput) {
    exportPdf(pdf: { html: $html, margin: $margin })
  }
`;
