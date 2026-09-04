import { useState } from "react";
import "./App.css";
import Register from "./Register";
import Login from "./Login";
import PizzaBuilder from "./PizzaBuilder";

function App() {
  const [page, setPage] = useState("home");
  const [status, setStatus] = useState("Order Received");

  const statuses = [
    "Order Received",
    "In Kitchen",
    "Sent to Delivery",
    "Delivered"
  ];

  if (page === "register") {
    return (
      <div className="container">
        <button onClick={() => setPage("home")}>← Back</button>
        <Register />
      </div>
    );
  }

  if (page === "login") {
    return (
      <div className="container">
        <button onClick={() => setPage("home")}>← Back</button>
        <Login />
      </div>
    );
  }

  if (page === "builder") {
    return (
      <div>
        <button onClick={() => setPage("home")}>← Back</button>
        <PizzaBuilder />
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <h1>🍕 Pizza Delivery</h1>

        <div>
          <button onClick={() => setPage("login")}>Login</button>
          <button onClick={() => setPage("register")}>Register</button>
        </div>
      </header>

      <main className="container">
        <h2>Fresh Pizza, Delivered Fast!</h2>
        <p>Choose your favorite pizza and order it easily.</p>

        <h2>Our Pizzas</h2>

        <div className="pizza-list">
          <div className="pizza-card">
            <h3>🍕 Margherita</h3>
            <p>Classic cheese and tomato pizza.</p>
            <h4>₹199</h4>
            <button onClick={() => setPage("builder")}>
              Order Now
            </button>
          </div>

          <div className="pizza-card">
            <h3>🍕 Farmhouse</h3>
            <p>Fresh vegetables with delicious cheese.</p>
            <h4>₹299</h4>
            <button onClick={() => setPage("builder")}>
              Order Now
            </button>
          </div>

          <div className="pizza-card">
            <h3>🍕 Veggie</h3>
            <p>Loaded with fresh and tasty vegetables.</p>
            <h4>₹249</h4>
            <button onClick={() => setPage("builder")}>
              Order Now
            </button>
          </div>

          <div className="pizza-card">
            <h3>🍕 Cheese Burst</h3>
            <p>Extra cheese for a delicious experience.</p>
            <h4>₹349</h4>
            <button onClick={() => setPage("builder")}>
              Order Now
            </button>
          </div>
        </div>

        <h2>Custom Pizza</h2>

        <div className="pizza-card">
          <p>Build your own pizza with your favorite ingredients.</p>

          <button onClick={() => setPage("builder")}>
            🍕 Build Custom Pizza
          </button>
        </div>

        <h2>Order Tracking</h2>

        <div className="pizza-card">
          {statuses.map((item, index) => (
            <p key={item}>
              {statuses.indexOf(status) >= index ? "🟢" : "⚪"} {item}
            </p>
          ))}

          <button
            onClick={() => {
              const next = statuses.indexOf(status) + 1;

              if (next < statuses.length) {
                setStatus(statuses[next]);
              }
            }}
          >
            Update Order Status
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;