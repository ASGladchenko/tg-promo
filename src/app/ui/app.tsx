import { ProviderRoutes } from "../providers/routes-provider";

import "./app.scss";

export function App() {
  return <ProviderRoutes />;
}
// export function App() {
//   return (
//     <main className="page">
//       <TelegramGate>
//         <AuthGate>
//           <RealtimeGate />
//           <WidgetHeader siteUrl={"/google.com"} />
//           <AttemptsWalletWidget />
//           <LotteryPage />
//         </AuthGate>
//       </TelegramGate>
//     </main>
//   );
// }
