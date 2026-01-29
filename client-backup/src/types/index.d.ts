export {};

declare global {
  interface Window {
    promptEvent: function;
    userAgentString: string;
  }
}
