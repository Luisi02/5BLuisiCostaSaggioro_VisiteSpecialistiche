export const createMiddleware = () => {
    return {
        load: async () => {
            const response = await fetch("http://localhost:5600/bookings");
            const json = await response.json();
            return json;
        },
        loadByDate: async (date) => {
            const response = await fetch("http://localhost:5600/bookings/date/" + date);
            const json = await response.json();
            return json;
        },
        delete: async (id) => {
            const response = await fetch("http://localhost:5600/delete-booking/" + id, {
                method: "DELETE",
            });
            const json = await response.json();
            return json;
        },
        add: async (booking) => {
            const response = await fetch("http://localhost:5600/insert-booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ booking: booking }),
            });
            const json = await response.json();
            return json;
        },
        truncateTables: async () => {
            const response = await fetch("http://localhost:5600/truncate-tables", {
                method: "DELETE",
            });
            const json = await response.json();
            return json;
        },
        dropTables: async () => {
            const response = await fetch("http://localhost:5600/drop-tables", {
                method: "DELETE",
            });
            const json = await response.json();
            return json;
        },
        addType: async (nametype) => {
            const response = await fetch("http://localhost:5600/insert-type", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: nametype }),
            });
            return await response.json();
        },
        loadTypes: async () => {
            const response = await fetch("http://localhost:5600/types");
            return await response.json();
        }
    };
};