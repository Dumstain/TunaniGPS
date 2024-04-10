import { ComponenteFooterPag } from '../components/ComponenteFooterPag';
import ComponenteHeader from '../components/ComponenteHeader';
import { ComponenteInfoCooperativa } from '../components/ComponenteInfoCooperativa';



function InformacionCooperativaPage() {
  return (
    <div className="App">
      
      <header className="App-header">
        <ComponenteHeader/>
      </header>
      <body>
        <ComponenteInfoCooperativa/>
      </body>
      <footer>
        <ComponenteFooterPag/>
      </footer>
    </div>
  );
}

export default InformacionCooperativaPage;
