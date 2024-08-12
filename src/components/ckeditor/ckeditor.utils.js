/* eslint-disable camelcase */

const ENV_URL_MAP = {
  "api-dev.scrut.io:3006": "api-dev.scrut.io/api/v1/fileUploaderService",
  "api-stage.scrut.io:3006": "api-stage.scrut.io/api/v1/fileUploaderService",
  "app.scrut.io:3006": "app.scrut.io/api/v1/fileUploaderService",
};

const getURLbasedOnEnv = (url) =>
  Object.keys(ENV_URL_MAP).reduce(
    (acc, envUrl) =>
      url.includes(envUrl) ? url.replace(envUrl, ENV_URL_MAP[envUrl]) : acc,
    url
  );

const getToken = (tokenType) => {
  return new Promise((resolve, reject) => {
    if (tokenType === "pdf") {
      resolve(
        "https://92326.cke-cs.com/token/dev/6bb132f61dbf61706479f73f5e4ffd55a6435cdb23575a6b6ad2ba90c442"
      );
    } else if (tokenType === "word") {
      resolve(
        "https://92326.cke-cs.com/token/dev/73c5c000c3a3ed0fab6fcf2b2f0e522478ac15fcb6aeffd6196fa4b875df"
      );
    } else {
      reject("Invalid token type");
    }
  });
};

const getAuthHeaders = () => {
  return {
    Authorization: `Bearer test-empty`,
    "auth-id-token": `Bearer test-empty`,
    "auth-access-token": `Bearer test-empty`,
    refreshToken: `Bearer test-empty`,
  };
};

const ckeditorPdfOptions = {
  format: "A4",
  margin_top: "10mm",
  margin_bottom: "10mm",
  margin_right: "10mm",
  margin_left: "10mm",
  page_orientation: "portrait",
  footer_html:
    '<div class="styled"><div class="styled-watermark">Document created in <a href="https://www.scrut.io" target="_blank">Scrut</a></div></div>',
  header_and_footer_css: `.styled { text-align: center; padding: 8px 0; } .styled-watermark { font-size: 12px; color: #737373; }`,
  extra_http_headers: getAuthHeaders(),
};

export { getToken, ckeditorPdfOptions, getAuthHeaders, getURLbasedOnEnv };
