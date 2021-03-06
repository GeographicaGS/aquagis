/*
 * Function to create AquaGIS Simulation category metadata.
 */

--------------------------------------------------------------------------------
-- HOW TO USE:
-- SELECT urbo_createmetadata_aq_simul(FALSE);
--------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS urbo_createmetadata_aq_simul(boolean);

CREATE OR REPLACE FUNCTION urbo_createmetadata_aq_simul(
    isdebug boolean DEFAULT FALSE
  )
  RETURNS void AS
  $$
  DECLARE
  	_tb_categories text;
    _tb_entities text;
    _tb_variables text;
    _dml_qry text;
  BEGIN

  	_tb_categories = urbo_get_table_name('metadata', 'categories');
    _tb_entities = urbo_get_table_name('metadata', 'entities');
    _tb_variables = urbo_get_table_name('metadata', 'variables');

    _dml_qry = format('
      -- CATEGORIES
      INSERT INTO %s
          (id_category,                   category_name,                  nodata,                 config                                    )
        VALUES
          (''aq_simul'',                  ''Escenarios futuros'',         FALSE,                  ''{"carto": {"account": "urbo-default"}}'');

      -- STATIC ENTITIES
      INSERT INTO %s
          (id_entity,                     entity_name,                              id_category,            table_name,                         mandatory,    editable)
        VALUES
          (''aq_cata.plot_simulation'',   ''Escenarios futuros de parcelas'',       ''aq_simul'',           ''aq_cata_plot_simulation'',        FALSE,        FALSE   ),
          (''aq_cata.const_simulation'',  ''Escenarios futuros de construcciones'', ''aq_simul'',           ''aq_cata_const_simulation'',       FALSE,        FALSE   ),
          (''aq_cata.const_type'',        ''Tipos de contrucciones'',               ''aq_simul'',           ''aq_cata_const_type'',             FALSE,        FALSE   );

      -- STATIC VARIABLES
      INSERT INTO %s
          (id_variable,                             id_entity,                      entity_field,   var_name,                 var_units,    var_thresholds,     var_agg,                            var_reverse,    config,   table_name,   type,          mandatory,   editable)
        VALUES
          (''aq_cata.plot_simulation.tipo'',        ''aq_cata.plot_simulation'',    ''tipo'',       ''Tipo'',                 NULL,         NULL,               ''{"NOAGG"}'',                      FALSE,          NULL,     NULL,         ''catalogue'', FALSE,       FALSE   ),
          (''aq_cata.plot_simulation.calibre'',     ''aq_cata.plot_simulation'',    ''calibre'',    ''Calibre'',              NULL,         NULL,               ''{"SUM", "AVG", "MIN", "MAX"}'',   FALSE,          NULL,     NULL,         ''catalogue'', FALSE,       FALSE   ),
          (''aq_cata.plot_simulation.n_personas'',  ''aq_cata.plot_simulation'',    ''n_personas'', ''Número de personas'',   NULL,         NULL,               ''{"SUM", "AVG", "MIN", "MAX"}'',   FALSE,          NULL,     NULL,         ''catalogue'', FALSE,       FALSE   ),

          (''aq_cata.const_simulation.floor'',      ''aq_cata.const_simulation'',   ''floor'',      ''Planta'',               NULL,         NULL,               ''{"NOAGG"}'',                      FALSE,          NULL,     NULL,         ''catalogue'', FALSE,       FALSE   ),
          (''aq_cata.const_simulation.usage'',      ''aq_cata.const_simulation'',   ''usage'',      ''Uso'',                  NULL,         NULL,               ''{"NOAGG"}'',                      FALSE,          NULL,     NULL,         ''catalogue'', FALSE,       FALSE   ),
          (''aq_cata.const_simulation.calibre'',    ''aq_cata.const_simulation'',   ''calibre'',    ''Calibre'',              NULL,         NULL,               ''{"SUM", "AVG", "MIN", "MAX"}'',   FALSE,          NULL,     NULL,         ''catalogue'', FALSE,       FALSE   );
    ',
    _tb_categories, _tb_entities, _tb_variables
    );

    IF isdebug IS TRUE then
      RAISE NOTICE '%', _dml_qry;
    END IF;

    EXECUTE _dml_qry;

  	EXCEPTION WHEN unique_violation THEN RAISE NOTICE 'METADATA FOR aq_simul CATEGORY ALREADY EXISTS';

  END;
  $$ LANGUAGE plpgsql;
