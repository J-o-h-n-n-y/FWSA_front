import { useState } from "react";

function TabComponet() {
    const [activeTab, setActiveTab] = useState(1);
    const navigate = (event, tab) => {
        setActiveTab(tab);
        event.preventDefault();
    };

return (
    <div></div>
  );
};

export default TabComponet;