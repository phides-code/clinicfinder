import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Provider } from './ClinicianSignup';

export interface Category {
    title: string;
    alias: string;
    parent_aliases: any[];
}

const FindAProvider = () => {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [providers, setProviders] = useState<Provider[] | string | null>(
        null
    );
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data.categories);
        })();
    }, []);

    const getProviders = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        ev.preventDefault();
        console.log(`getting providers for category: ${ev.target.value}`);
        console.log(`postal code: ${currentUser?.postalcode}`);

        (async () => {
            try {
                const res = await fetch('/api/providers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        postalcode: currentUser?.postalcode,
                        category: ev.target.value,
                    }),
                });
                const data = await res.json();

                if (data.status === 200) {
                    console.log(`got data:`);
                    console.log(data);
                    // setProfile(data.profile);
                    setProviders(data.providers);
                } else {
                    console.log('error fetching providers');
                    console.log(data.message);
                    setProviders('none found');
                    // window.alert(`error fetching providers: ${data.message}`);
                }
            } catch (err) {
                console.log(`caught error fetching providers`);
                setProviders('none found');
                // window.alert(`error fetching providers`);
            }
        })();
    };

    return categories ? (
        <Wrapper>
            <SelectClinic>
                <div>Select a category of healthcare:</div>
                <select
                    onChange={
                        getProviders
                        // (ev) => {getProviders(ev)}
                    }
                >
                    {/* <option>Select a category of healthcare:</option> */}
                    <option value='0'>-</option>
                    {categories.map((category) => {
                        return (
                            <option value={category.alias} key={category.alias}>
                                {category.title}
                            </option>
                        );
                    })}
                </select>
            </SelectClinic>
            {providers && providers !== 'none found' ? (
                <ClinicList>
                    Found {providers.length} providers in your area:
                    {Array.isArray(providers) &&
                        providers.map((provider, i) => {
                            return (
                                <div>
                                    <hr />
                                    <StyledLink
                                        to={`/clinicdetail/${provider.id}`}
                                        key={i}
                                    >
                                        <Result>
                                            <div>
                                                <div>
                                                    <h3>{provider.name}</h3>
                                                </div>
                                                <div>
                                                    {provider.location.address1}
                                                </div>
                                                <div>
                                                    <strong>Distance:</strong>{' '}
                                                    {(
                                                        Math.floor(
                                                            provider.distance
                                                        ) / 1000
                                                    ).toFixed(2)}{' '}
                                                    km
                                                </div>
                                                <div>
                                                    <strong>
                                                        Services provided:
                                                    </strong>
                                                    {provider.categories.map(
                                                        (category) => {
                                                            return (
                                                                <div>
                                                                    {' '}
                                                                    {
                                                                        category.title
                                                                    }
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                                <div>
                                                    <strong>Rating:</strong>{' '}
                                                    {provider.rating} / 5
                                                </div>
                                            </div>
                                            <div>
                                                <StyledImg
                                                    src={provider.image_url}
                                                />
                                            </div>
                                        </Result>
                                    </StyledLink>
                                </div>
                            );
                        })}
                </ClinicList>
            ) : (
                providers === 'none found' && <div>No providers found.</div>
            )}
        </Wrapper>
    ) : (
        <Wrapper>{`Loading... `}</Wrapper>
    );
};

const StyledImg = styled.img`
    height: 75px;
`;

const Result = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    align-content: stretch;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: royalblue;
    &:visited {
        text-decoration: none;
        color: royalblue;
    }
`;

const ClinicList = styled.div`
    background-color: white;
    /* margin: 20px; */
    margin-bottom: 10px;
    border-radius: 5px;
    padding: 10px 20px;
    /* width: 400px; */
    width: 300px;
`;

const SelectClinic = styled.div`
    background-color: white;
    margin: 20px;
    border-radius: 5px;
    padding: 10px 20px;
    width: 300px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: stretch;
`;

export default FindAProvider;
