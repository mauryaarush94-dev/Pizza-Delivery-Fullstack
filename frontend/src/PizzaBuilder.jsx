import { useState } from "react";

function PizzaBuilder() {
  const [base, setBase] = useState("Classic");
  const [sauce, setSauce] = useState("Tomato");
  const [cheese, setCheese] = useState("Mozzarella");
  const [vegetables, setVegetables] = useState([]);

  const bases = {
    "Thin Crust": 100,
    Classic: 120,
    Wheat: 130,
    Pan: 140,
    "Cheese Burst": 160
  };

  const sauces = {
    Tomato: 30,
    BBQ: 40,
    Garlic: 40,
    "Peri Peri": 45,
    Spicy: 35
  };

  const cheeses = {
    Mozzarella: 70,
    Cheddar: 80
  };

  const veggies = {
    Onion: 20,
    Capsicum: 20,
    Corn: 25,
    Tomato: 20,
    Mushroom: 30
  };

  const toggleVegetable = (item) => {
    setVegetables(
      vegetables.includes(item)
        ? vegetables.filter((v) => v !== item)
        : [...vegetables, item]
    );
  };

  const total =
    bases[base] +
    sauces[sauce] +
    cheeses[cheese] +
    vegetables.reduce((sum, item) => sum + veggies[item], 0);

  const addOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        base,
        sauce,
        cheese,
        vegetables,
        amount: total
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert(`Payment Successful! Order placed successfully 🎉\nTotal: ₹${total}`);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="container">
      <h2>🍕 Custom Pizza Builder</h2>

      <div className="pizza-card">
        <h3>Choose Base</h3>

        {Object.keys(bases).map((item) => (
          <button key={item} onClick={() => setBase(item)}>
            {item} ₹{bases[item]}
          </button>
        ))}

        <h3>Choose Sauce</h3>

        {Object.keys(sauces).map((item) => (
          <button key={item} onClick={() => setSauce(item)}>
            {item} ₹{sauces[item]}
          </button>
        ))}

        <h3>Choose Cheese</h3>

        {Object.keys(cheeses).map((item) => (
          <button key={item} onClick={() => setCheese(item)}>
            {item} ₹{cheeses[item]}
          </button>
        ))}

        <h3>Choose Vegetables</h3>

        {Object.keys(veggies).map((item) => (
          <button key={item} onClick={() => toggleVegetable(item)}>
            {vegetables.includes(item) ? "✓ " : ""}
            {item} ₹{veggies[item]}
          </button>
        ))}

        <hr />

        <h3>Order Summary</h3>

        <p><b>Base:</b> {base}</p>
        <p><b>Sauce:</b> {sauce}</p>
        <p><b>Cheese:</b> {cheese}</p>

        <p>
          <b>Vegetables:</b>{" "}
          {vegetables.length ? vegetables.join(", ") : "None"}
        </p>

        <h2>💰 Total: ₹{total}</h2>

        <button onClick={addOrder}>
          💳 Pay ₹{total} & Place Order
        </button>
      </div>
    </div>
  );
}

export default PizzaBuilder;