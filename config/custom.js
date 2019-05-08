/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

    /***************************************************************************
     *                                                                          *
     * Any other custom config this Sails app should use during development.    *
     *                                                                          *
     ***************************************************************************/
    ldap: {
        url: 'ldaps://ldap.htwg-konstanz.de:636',
        searchBase: 'ou=users,dc=fh-konstanz,dc=de',
        searchFilter: 'uid={{username}}',
        rejectUnauthorized: false
    },
    seezeit: {
        canteen: {
            deEndpoint: "http://www.max-manager.de/daten-extern/seezeit/xml/mensa_htwg/speiseplan.xml",
            enEndpoint: "http://www.max-manager.de/daten-extern/seezeit/xml/mensa_htwg/speiseplan_en.xml"
        }
    },
    events: {
      urlopen: "https://www.htwg-konstanz.de/studium/pruefungsangelegenheiten/terminefristen/"
    },
    datacenter: {
        printerBalance: {
            loginEndpoint: "https://login.rz.htwg-konstanz.de/index.spy",
            balanceEndpoint: "https://login.rz.htwg-konstanz.de/userprintacc.spy?activeMenu=Druckerkonto"
        },
        lsf: {
            loginEndpoint: "https://lsf.htwg-konstanz.de/qisserver/rds?state=user&type=1&category=auth.login&startpage=portal.vm&breadCrumbSource=portal",
            loginPage: "https://lsf.htwg-konstanz.de/qisserver/rds?state=user&type=0&breadCrumbSource=portal&topitem=functions",
            icalPage: "https://lsf.htwg-konstanz.de/qisserver/rds?state=wplan&act=stg&pool=stg&show=plan&P.vx=kurz&missing=allTerms&k_parallel.parallelid=&k_abstgv.abstgvnr=${id}&r_zuordabstgv.phaseid=",
            lecturePage: "https://lsf.htwg-konstanz.de/qisserver/rds?state=wplan&act=show&show=plan&P.subc=plan&fil=plu&mtknr=&UserSignature=",
            lectureProfPage: "https://lsf.htwg-konstanz.de/qisserver/rds?state=wplan&act=Dozent&show=plan&P.subc=plan&personal.pid=${pid}&navigationPosition=functions%2CscheduleDozent&breadcrumb=schedule&topitem=functions&subitem=scheduleDozent",
            pidPage: "https://lsf.htwg-konstanz.de/qisserver/rds?state=user&type=0&category=menu.browse&breadCrumbSource=portal&startpage=portal.vm&chco=y",
            ids: [
                {
                    id: 4511,
                    name: "Angewandte Informatik (Bachelor)"
                },
                {
                    id: 4463,
                    name: "Architektur Bachelor"
                },
                {
                    id: 4475,
                    name: "Architektur Bachelor"
                },
                {
                    id: 4510,
                    name: "Automobilinformationstechnik"
                },
                {
                    id: 4459,
                    name: "Automotive System Engineering (Master)"
                },
                {
                    id: 4477,
                    name: "Bauingenieur Master"
                },
                {
                    id: 4464,
                    name: "Bauingenieurwesen"
                },
                {
                    id: 4504,
                    name: "Betriebswirtschaftslehre (BWB)"
                },
                {
                    id: 4465,
                    name: "Business Information Technology (Master)"
                },
                {
                    id: 4507,
                    name: "Elektrische Systeme (Master)"
                },
                {
                    id: 4470,
                    name: "Elektrotechnik und Informationstechnik (Bach.)"
                },
                {
                    id: 4518,
                    name: "Gesundheitsinformatik (Bachelor)"
                },
                {
                    id: 4505,
                    name: "Informatik Master"
                },
                {
                    id: 4454,
                    name: "Internationales Management Asien (Master)"
                },
                {
                    id: 4522,
                    name: "International Project Engineering"
                },
                {
                    id: 4466,
                    name: "Kommunikationsdesign (Bachelor)"
                },
                {
                    id: 4479,
                    name: "Kommunikationsdesign (Master)"
                },
                {
                    id: 4524,
                    name: "Kooperatives Promotionskolleg"
                },
                {
                    id: 4520,
                    name: "Legal Management (WRM)"
                },
                {
                    id: 4476,
                    name: "Maschinenbau Entwicklung und Produktion"
                },
                {
                    id: 4478,
                    name: "Maschinenbau Konstruktion und Entwicklung"
                },
                {
                    id: 4481,
                    name: "Mechanical Engineering and International Sales Man"
                },
                {
                    id: 4480,
                    name: "Mechatronik (Master)"
                },
                {
                    id: 4486,
                    name: "Software Engineering (Bachelor)"
                },
                {
                    id: 4461,
                    name: "Studienkolleg (STK) Technik"
                },
                {
                    id: 4462,
                    name: "Studienkolleg (STK) Wirtschaft"
                },
                {
                    id: 4519,
                    name: "Umwelttechnik und Ressourcenmanagement (Bachelor)"
                },
                {
                    id: 4490,
                    name: "Umwelt- und Verfahrenstechnik (Master)"
                },
                {
                    id: 4512,
                    name: "Unternehmensführung (BWM)"
                },
                {
                    id: 4491,
                    name: "Verfahrens- und Umwelttechnik"
                },
                {
                    id: 4496,
                    name: "Wirtschaftsinformatik (Bachelor)"
                },
                {
                    id: 4494,
                    name: "Wirtschaftsingenieur Bauwesen"
                },
                {
                    id: 4502,
                    name: "Wirtschaftsingenieur Bauwesen (Master)"
                },
                {
                    id: 4503,
                    name: "Wirtschaftsingenieur Elektrotechnik (Master)"
                },
                {
                    id: 4471,
                    name: "Wirtschaftsingenieur Elektro- und Informationstech"
                },
                {
                    id: 4495,
                    name: "Wirtschaftsingenieur Maschinenbau"
                },
                {
                    id: 4497,
                    name: "Wirtschaftsingenieur Maschinenbau (Master)"
                },
                {
                    id: 4514,
                    name: "Wirtschaftsrecht (WRB)"
                },
                {
                    id: 4508,
                    name: "Wirtschaftssprache Deutsch und Tourismusmanagement"
                },
                {
                    id: 4515,
                    name: "Wirtschaftssprachen Asien und Management - China"
                },
                {
                    id: 4516,
                    name: "Wirtschaftssprachen Asien und Management - S.Asien"
                },
                {
                    id: 4499,
                    name: "Zusatzangebote"
                }
            ]
        },
        qisserver: {
            loginEndpoint: "https://qisserver.htwg-konstanz.de/qisserver/rds;jsessionid={sessionID}?state=user&type=1&category=auth.login&startpage=portal.vm",
            loginPage: "https://qisserver.htwg-konstanz.de/qisserver/rds?state=user&type=0",
            overviewPage: "https://qisserver.htwg-konstanz.de/qisserver/rds?state=change&type=1&moduleParameter=studyPOSMenu&nextdir=change&next=menu.vm&subdir=applications&xml=menu&purge=y&navigationPosition=functions%2CstudyPOSMenu&breadcrumb=studyPOSMenu&topitem=loggedin&subitem=studyPOSMenu",
            bachelorGradesPage: "https://qisserver.htwg-konstanz.de/qisserver/rds?state=notenspiegelStudent&next=list.vm&nextdir=qispos/notenspiegel/student&createInfos=Y&struct=auswahlBaum&nodeID=auswahlBaum%7Cabschluss%3Aabschl%3D84&expand=0&asi={asiToken}#auswahlBaum%7Cabschluss%3Aabschl%3D84",
            masterGradesPage: "https://qisserver.htwg-konstanz.de/qisserver/rds?state=notenspiegelStudent&next=list.vm&nextdir=qispos/notenspiegel/student&createInfos=Y&struct=auswahlBaum&nodeID=auswahlBaum%7Cabschluss%3Aabschl%3D90&expand=0&asi={asiToken}#auswahlBaum%7Cabschluss%3Aabschl%3D90",
            graduationOverview: "https://qisserver.htwg-konstanz.de/qisserver/rds?state=notenspiegelStudent&next=tree.vm&nextdir=qispos/notenspiegel/student&menuid=notenspiegelStudent&breadcrumb=notenspiegel&breadCrumbSource=menu&asi={asiToken}"
        }
    }
};
