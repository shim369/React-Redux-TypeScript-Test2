import React from "react";
import MyRouter from "./router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Header />
      <div className="container">
        <main className="main">
          <MyRouter />
        </main>
      </div>
    </Provider>
  );
};

export default App;
