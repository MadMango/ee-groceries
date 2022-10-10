export const getGroceries = async () => {
  const res = await fetch('http://localhost:5000/groceries');

  const json = await res.json();
  return json;
};

export const addNewItem = async (item) => {
  const res = await fetch(`http://localhost:5000/groceries`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  });

  const json = await res.json();
  return json;
};

export const deleteItem = async (key) => {
  const res = await fetch(`http://localhost:5000/groceries/${key}`, {
    method: 'DELETE'
  });

  const json = await res.json();
  return json;
};

export const resetGroceries = async () => {
  const res = await fetch(`http://localhost:5000/groceries/reset`, {
    method: 'POST'
  });

  const json = await res.json();
  return json;
};

export const updateAllGroceries = async (groceries) => {
  const res = await fetch(`http://localhost:5000/groceries`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(groceries)
  });

  const json = await res.json();
  return json;
};