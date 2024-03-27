import { FormEvent } from "react";
import { useSWRConfig } from "swr";

const AddTodos = () => {
  const { mutate } = useSWRConfig();
  
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Update this URL to your Cloudflare Worker endpoint
    const endpoint = "https://cl-todos-back.d.htd.ink/todos";
    
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          // Additional headers like Authorization can be added here
        },
        body: JSON.stringify({ todo: formData.get("todo") }),
      });

      const resData = await res.json();

      if (resData?.success) {
        (e.target as HTMLFormElement).reset();
        mutate("/todos");
      }
    } catch (error) {
      console.error("Error submitting todo:", error);
    }
  };
  
  return (
    <section className="add-todos-section">
      <div className="add-todos-meta">
        <h2 className="todos-heading">All Todos</h2>
      </div>

      <form onSubmit={handleFormSubmit} className="add-todos-form">
        <input type="text" placeholder="Enter todo..." name="todo" id="todo" />
        <button type="submit">Add</button>
      </form>
    </section>
  );
};

export default AddTodos;