import { inject, observer } from 'mobx-react';
import React from 'react'
import Layout from '../../Component/Layout/front.layout';

const Index = (props) => {
    props.AuthStore.getToken();
    
    return (
        <Layout>
            <div>
                <p>Burası Anasayfa</p>
            </div>
        </Layout>
    )
}

export default inject("AuthStore")(observer(Index));
