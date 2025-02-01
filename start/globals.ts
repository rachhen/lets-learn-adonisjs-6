import Roles from '#enums/roles'
import { icons as phIcons } from '@iconify-json/ph'
import { addCollection, edgeIconify } from 'edge-iconify'
import edge from 'edge.js'

addCollection(phIcons)

edge.use(edgeIconify)
edge.global('Roles', Roles)
