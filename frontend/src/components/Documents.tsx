import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
const moment = require('moment');

export interface Document {
    _id: string;
    type: string;
    clinicName: string;
    patientName: string;
    timestamp: string;
    appointmentDate: string;
    serviceCategory: string;
    cost: number;
    patientId: string;
    clinicId: string;
}

const Documents = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const [documents, setdocuments] = useState<Document[] | null>(null);

    useEffect(() => {
        const checkLocalUser = localStorage.getItem('healthUser');
        if (!checkLocalUser || !currentUser) {
            console.log(`no logged in user found, redirecting...`);
            navigate('/login');
        } else {
            (async () => {
                try {
                    console.log(
                        `fetching documents for patient ID ${currentUser.patientId}`
                    );
                    const res = await fetch(`/api/getdocuments`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            queryParams: {
                                patientId: currentUser.patientId,
                            },
                        }),
                    });
                    const data = await res.json();

                    if (data.status === 200) {
                        console.log(`got documents`);
                        setdocuments(data.documents);
                    } else {
                        console.log('no documents found');
                        console.log(data.document);
                        window.alert('no documents found');
                        setdocuments([]);
                    }
                } catch (err) {
                    console.log(`caught error fetching documents`);
                    console.log(err);
                    window.alert(`caught error fetching documents`);
                }
            })();
        }
    }, [currentUser, navigate]);

    return documents && currentUser ? (
        <Wrapper>
            <h1>
                Receipts
                {currentUser.userType === 'clinician' ? (
                    <> issued by {currentUser.clinicName}</>
                ) : (
                    <> for {currentUser.name}</>
                )}
            </h1>
            {documents.length !== 0 ? (
                <DocumentList>
                    {documents.filter(
                        (document) =>
                            document.patientId === currentUser._id ||
                            document.clinicId === currentUser.clinicId
                    ).length === 0 && <>None found</>}
                    {documents.map((document) => {
                        if (
                            document.patientId === currentUser._id ||
                            document.clinicId === currentUser.clinicId
                        ) {
                            return (
                                <div key={document._id}>
                                    <hr />
                                    <StyledLink
                                        to={`/viewdocument/${document._id}`}
                                    >
                                        {currentUser.userType ===
                                            'clinician' && (
                                            <div>
                                                <strong>Patient:</strong>{' '}
                                                {document.patientName}
                                            </div>
                                        )}
                                        <div>
                                            <strong>Service: </strong>
                                            {document.serviceCategory} at{' '}
                                            {document.clinicName}
                                        </div>
                                        <div>
                                            <strong>Date:</strong>
                                            {moment(document.timestamp).format(
                                                'MMMM Do YYYY, hh:mm:ss a'
                                            )}
                                        </div>
                                    </StyledLink>
                                </div>
                            );
                        }
                        return null;
                    })}
                </DocumentList>
            ) : (
                <div>No documents found.</div>
            )}
        </Wrapper>
    ) : (
        <Wrapper>Loading ...</Wrapper>
    );
};

const DocumentList = styled.div`
    display: flex;
    flex-direction: column-reverse;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: royalblue;
    &:visited {
        text-decoration: none;
        color: royalblue;
    }
`;

const Wrapper = styled.div`
    padding: 5px;
    border-radius: 10px;
    margin: 50px 50px;
    background-color: white;
`;

export default Documents;
