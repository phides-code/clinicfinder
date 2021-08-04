import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";

const FindAProvider = () => {

  const [categories, setCategories] = useState(null);
  const [providers, setProviders] = useState(null);
  const {
    currentUser,
  } = useContext(UserContext);


  useEffect(() => {
    (async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories);
    })();
  }, []);

  const getProviders = (ev) => {
    ev.preventDefault();
    console.log(`getting providers for category: ${ev.target.value}`);
    console.log(`postal code: ${currentUser.postalcode}`);

    (async () => {
      try {
        const res = await fetch("/api/providers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            postalcode: currentUser.postalcode,
            category: ev.target.value
          })
        });
        const data = await res.json();

        if (data.status === 200) {
          console.log(`got data:`);
          console.log(data);
          // setProfile(data.profile);
          setProviders(data.providers);
        } else {
          console.log("error fetching providers");
          console.log(data.message);
          setProviders("none found");
          // window.alert(`error fetching providers: ${data.message}`);
        }

      } catch (err) {
        console.log(`caught error fetching providers`);
        setProviders("none found");
        // window.alert(`error fetching providers`);

      }
    })();

  }

  return (
    categories ?
      <div>
        <select onChange={getProviders}>
          <option>Select a category of healthcare:</option>
          {
            categories.map(category => {
              return (<option value={category.alias} key={category.alias}>{category.title}</option>);
            })
          }
        </select>
        {
          (providers && providers !== "none found") ?
            <div>
              Got {providers.length} providers:
              {
                providers.map((provider, i) => {
                  return (
                    <Link to={`/clinicdetail/${provider.id}`} key={i}>
                      <div>
                        <hr/>
                        <div>{provider.alias}</div>
                        <div>{provider.name}</div>
                        <div>{provider.display_phone}</div>
                      </div>
                    </Link>
                  );
                })
              }
            </div> 
            : (providers === "none found") && <div>No providers found.</div>
        }
      </div> 
      :
      <div>
        {`Loading... `}
      </div>
  );
};

export default FindAProvider;