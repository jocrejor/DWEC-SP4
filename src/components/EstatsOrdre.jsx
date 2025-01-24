import {useState, useEffect} from 'react'
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import language from 'datatables.net-plugins/i18n/es-ES.mjs'
import Header from './Header';
import {url,getData} from '../apiAccess/crud'


 function EstatsOrdre() {

    const columnesDataTAbles =  [{data: 'id'}, {data: 'name'}]
    const [estat, setEstat] = useState('Lista');

  
    useEffect(() => {

        const inicialitza = async () => {
            const data = await getData(url, "OrderReception_Status")
            setEstat(data)
          }
          inicialitza()
          console.log(estat)
     }, [])
    

     DataTable.use(DT);
  
return (
    <>
    <Header title="Estats Ordre" />

    <DataTable 
        columns = {columnesDataTAbles}
        data={estat} 
        className="display"
        options={{
                language: language,
                info: false,
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