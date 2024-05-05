export default ( { className = '' } ) => {
	return (
		<div className={ `loader-container ${ className }` }>
			<div className={ 'loader' }></div>
		</div>
	);
};
