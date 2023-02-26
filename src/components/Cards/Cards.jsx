import Card from '../Card/Card';
import styles from './Cards.module.css'

export default function Cards(props) {
   const { characters } = props;
   return (
      <div className={styles.cards}>
         {characters.length ? characters.map(element =>
            <div key={element.id}>
               <Card
                  characters={element}
                  onClose={props.onClose}
               />
            </div>) : 'No hay personajes guardados'}
      </div>
   )
}
