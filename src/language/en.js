/**
 * 英文字符集
 */
export default {
    message: {
      base:{
        cancel:"Cancel",
        ok:"OK",
        back:"Back",
        required:"required",
        sysError: 'System error',
        noLogin:"Login information has expired",
        noLoginInfo:"The login information has timed out, please log in again!",
        apiError:"The interface returns a error format and does not contain the result key.",
        add:"Add",
        modify:"Modify",
        delete:"Remove",
        err1:"Unchecked data",
        confirm:"Are you confirm?",
        select:"Select Please",
        oper: "Operation",
      },
      login: {
        lang:"Language",
        userLogin: "User login",
        userName: 'Login name',
        psd: "Password",
        login:"Login",
        nameError: 'Please input your login name',
        psdError: 'Please input your password',
        prompt: 'name/password：admin/123456',
        loginError: 'Login error', 
        userError: 'The account does not exist or the password is wrong!',
        copyright:"©Chengdu Ruisi Shangzhi Technology Co., Ltd. 2024 All rights reserved"
      },
      main:{
        sysIntro:'The <b>"Ruisi BI"</b> business intelligence system is an enterprise data analysis system independently developed by <a href="http://www.ruisitech.com">Chengdu Ruisi Shangzhi Technology Co., Ltd</a>. and has independent intellectual property rights. The open source version contains data model, multi-dimensional analysis, data report, permission management and other functional modules, which is convenient for enterprises to quickly establish a set of easy-to-use, flexible and zero-cost commercial energy platforms, grasp the operation of enterprises through data, and support decision-making with data.',
        module:'Open source version of the function module',
        moduleIntro:'<p>1. Data model</p><p>2. Multidimensional analysis</p><p>3. Data report</p><p>4. Permission management</p>',
        buyUltimate:'Buy the ultimate version',
        start:"Start quickly",
        qq:"Technical exchange QQ group",
        more:"If you need more functions, you can",
        indexName:"Home",
        user:{
          info:"User information",
          psd:"Change password",
          question:"Feedback problem",
          book:"User manual",
          out:"Sign out",
          outSuccess:"Exit successfully"
        },
        info:{
          loginName: "Login name",
          userName: "Username",
          company: "User company",
          state: "Account status",
          cnt: "Number of logins",
          lastLogDate: "Last login time",
          uinfo: "Personal information",
          times:"times",
          compName:"Chengdu Ruisi Shangzhi Technology Co., Ltd",
          enable:"Enable",
          disable:"Disable",
        },
        psd:{
          title:"Change password",
          old:"Original password",
          new:"New password",
          confirm:"Repeat password",
          length:"The length of the password is 6 to 18 digits",
          error:"Original password is incorrect",
          error2: "Two passwords are inconsistent",
          success: "Password modified successfully"
        },
        navMenu:{
          flash: "Refresh current page",
          closeother: "Close other pages",
          closeall: "Close all pages",
          left:"Move to left",
          right:"Move to right",
        }
      },
      manage:{
        user:{
          name: "User Management",
          id:"ID",
          staff: "Staff number",
          userName: "Username",
          state: "State",
          logTimes: "Login times",
          logDate: "Login Date",
          userRole:"User Role",
          userMenu: "User Menu",
          man:"Man",
          woman:"Woman",
          newUser:"New user",
          modifyUser:"Modify user",
          staffNote:"Use to login",
          password:"Password",
          password2:"Repeat password",
          sex:"Gender",
          mobilePhone:"Mobile phone",
          officeTel:"Office Phone",
          email:"E-mail",
          suc1:"Modified Successfully",
          suc2:"Created Successfully",
          suc3:"Authorisation Successfully",
          suc4:"Removed Successfully",
          exist:"The account already exists.",
        },
        userMenu:{
          name:"User Management >> Menu of User",
          open:"Expand all",
          close:"Close all",
          suc:"Authorisation Successfully"
        },
        role:{
          name:"Role Management",
          roleMenu: "Role Menu",
          id:"ID",
          name:"Role name",
          desc:"Note",
          createUser:"Create user",
          createDate:"Create date",
          ord:"Sort",
          add:"New role",
          mod:"Modify role",
          suc:"Removed Successfully",
        },
        roleMenu: {
          name:"Role Management >> Role Menu ",
          suc:"Role Authorisation Successfully",
        },
        menu:{
          name:"Menu Management",
          note:"Click the right mouse button on the menu to create or edit the menu.",
          menuName:"Name",
          menuUrl:"URL",
          menuOrder:"Sort",
          menuDesc:"Note",
          pic:"Icon",
          root:"System Menu",
          urlNote:"If you create a directory, you don't need to fill in the URL.",
          err1:"The menu can only be built to 3 levels.",
          modify:"Modify Menu",
          add:"Add Menu",
        }
    },
    model:{
      title: "Data Model",
      dsource:{
        title: "Data Source",
        name:"Name",
        use:"Use",
        linkType:"Type",
        linkUrl:"Connection url",
        linkName:"Username",
        psd:"Password",
        suc1:"Removed Successfully!",
        jndiName:"JNDI Name",
        test:"Test Connection",
        crt:"Create Data Source",
        update:"Modify Data Source",
        suc2:"Test Connection Successfully",
        err2:"Please click the Test Connection first, and then click the OK button after the connection is successful.",
        suc3:"Modify Data Source Successfully",
        suc4:"Add Data Source Successfully",
      },
      dset:{
        title: "Data Set",
        flush:"Refresh",
        crt:"Create Data Set",
        update:"Modify Data Set",
        name:"Name",
        priTable:"Primary Table",
        dsname:"Data Source",
        useType:"Link",
        base:"Basic Information",
        join:"Table Join",
        search:"Search Tables",
        err1:"Please select the table",
        suc1:"Refresh Successfully",
        stable:"Select Tables",
        stable2:"List to be selected",
        stable3:"Selected tables",
        cols:"Table Column",
      },
      cube:{
        title: "Cube",
      }
    }
  }
}