import { registerTranslateConfig } from "lit-translate";

registerTranslateConfig({
  loader: (lang) =>  import((`../../../../lang/${lang}.json`))
});
