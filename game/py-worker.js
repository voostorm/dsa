/* Browser-local Python runtime. No user code is sent to an application server. */
let pyodidePromise=null;
async function engine(){
  if(!pyodidePromise){
    pyodidePromise=(async()=>{
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
      return await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});
    })();
  }
  return pyodidePromise;
}
self.onmessage=async(event)=>{
  const {id,code,fn,tests}=event.data;
  try{
    const py=await engine();
    py.globals.set('candidate_code',code);
    py.globals.set('function_name',fn);
    py.globals.set('test_payload',JSON.stringify(tests));
    const output=await py.runPythonAsync([
      'import json, copy, traceback',
      'namespace = {}',
      'response = {"results": [], "error": None}',
      'try:',
      '    exec(candidate_code, namespace)',
      '    function = namespace.get(function_name)',
      '    if not callable(function):',
      '        raise ValueError("Function " + function_name + " was not defined.")',
      '    for case in json.loads(test_payload):',
      '        try:',
      '            result = function(*copy.deepcopy(case["args"]))',
      '            response["results"].append({"value": result, "error": None})',
      '        except BaseException as exc:',
      '            response["results"].append({"value": None, "error": type(exc).__name__ + ": " + str(exc)})',
      'except BaseException as exc:',
      '    response["error"] = type(exc).__name__ + ": " + str(exc)',
      'json.dumps(response, default=str)'
    ].join('\n'));
    self.postMessage({id,ok:true,output:JSON.parse(output)});
  }catch(err){self.postMessage({id,ok:false,error:String(err && err.message || err)})}
};