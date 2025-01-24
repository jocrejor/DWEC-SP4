import {useState, useEffect} from 'react'
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import language from 'datatables.net-plugins/i18n/es-ES.mjs'
import Header from './Header';
import {url,getData} from '../apiAccess/crud'


function EstatsOrdre() {

    const columnesDataTAbles =  [{data: 'id'}, {data: 'name'}]
    const [data, setData] = useState([]);

  
    useEffect(() => {

        const inicialitza = async () => {
            const data = await getData(url, "OrderReception_Status")
            setData(data)
          }
          inicialitza()
          console.log(data)
          
        }, [])
    
   
  DataTable.use(DT);
return (
    <>
    <Header title="Estats Ordre" />

    <DataTable 
        columns = {columnesDataTAbles}
        data={data} 
        className="display"
        options={{
                language: language,
                responsive: true,
                select: true,
            }}
    >
    <thead>
        <tr>
            <th>Id</th>
            <th>Name</th>
        </tr>
    </thead>
</DataTable>

    </>
)

 }
 export default EstatsOrdre